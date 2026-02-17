#!/usr/bin/env python3
"""
Generate Mermaid concept maps from text descriptions of entities and relationships.

This script parses structured text descriptions of concepts and generates
Mermaid graph diagrams that visualize entities, their relationships, and attributes.
"""

import re
import sys
from typing import Dict, List, Tuple, Set
from dataclasses import dataclass, field


@dataclass
class Concept:
    """Represents a concept/entity in the domain model."""
    name: str
    type: str = "entity"  # entity, value_object, aggregate
    description: str = ""
    attributes: List[str] = field(default_factory=list)
    relationships: List[Tuple[str, str, str]] = field(default_factory=list)  # (target, type, cardinality)
    parent: str = None  # For inheritance/specialization
    

class ConceptMapGenerator:
    """Parses text descriptions and generates Mermaid concept maps."""
    
    def __init__(self):
        self.concepts: Dict[str, Concept] = {}
        
    def parse_text(self, text: str) -> None:
        """Parse structured text into concepts."""
        # Split by numbered entries (1-, 2-, 3-, etc.)
        entries = re.split(r'\n(?=\d+\s*-\s*)', text.strip())
        
        for entry in entries:
            if not entry.strip():
                continue
                
            concept = self._parse_entry(entry)
            if concept:
                self.concepts[concept.name] = concept
    
    def _parse_entry(self, entry: str) -> Concept:
        """Parse a single concept entry."""
        lines = [line.strip() for line in entry.split('\n') if line.strip()]
        
        if not lines:
            return None
            
        # First line: "1- ConceptName; Description"
        first_line = lines[0]
        match = re.match(r'\d+\s*-\s*([^;]+);\s*(.*)', first_line)
        
        if not match:
            return None
            
        name = match.group(1).strip()
        description = match.group(2).strip()
        
        concept = Concept(name=name, description=description)
        
        # Parse remaining lines (attributes and relationships)
        for line in lines[1:]:
            # Remove leading * or -
            line = re.sub(r'^\s*[\*\-]\s*', '', line)
            
            # Check for inheritance/specialization
            if 'is a type of' in line.lower() or 'is a' in line.lower():
                parent_match = re.search(r'is a(?:\s+type of)?\s+`?([^`\s]+)', line, re.IGNORECASE)
                if parent_match:
                    concept.parent = parent_match.group(1).strip()
                    concept.type = "specialized_entity"
            
            # Check for relationships
            elif 'associated with' in line.lower() or 'can be associated' in line.lower():
                rel_match = re.search(r'(?:associated with|can be associated with)\s+(\d+(?:\s+or\s+more)?)\s+`([^`]+)`', line, re.IGNORECASE)
                if rel_match:
                    cardinality = rel_match.group(1).strip()
                    target = rel_match.group(2).strip()
                    concept.relationships.append((target, "association", cardinality))
            
            # Check for composition/aggregation
            elif 'has' in line.lower() or 'can have' in line.lower():
                has_match = re.search(r'(?:has|can have)\s+(?:a\s+)?(?:(\d+(?:\s+or\s+more)?)\s+)?([^*\n]+)', line, re.IGNORECASE)
                if has_match:
                    cardinality = has_match.group(1).strip() if has_match.group(1) else "1"
                    attribute = has_match.group(2).strip()
                    
                    # Check if it's a reference to another concept (backticks or capital letter)
                    if '`' in attribute or attribute.split()[0][0].isupper():
                        target = attribute.replace('`', '').strip()
                        concept.relationships.append((target, "composition", cardinality))
                    else:
                        concept.attributes.append(attribute)
            
            # Check for earned by/created by relationships
            elif 'earned by' in line.lower() or 'created by' in line.lower():
                # Handle "earned by completing X or Y" patterns
                earned_match = re.search(r'(?:earned by|created by)\s+completing\s+([^*\n]+)', line, re.IGNORECASE)
                if earned_match:
                    sources = earned_match.group(1).strip()
                    # Split by "or" to handle multiple sources
                    for source in re.split(r'\s+or\s+', sources):
                        source = source.strip().capitalize()
                        concept.relationships.append((source, "earned_by", "0..*"))
                else:
                    earned_match = re.search(r'(?:earned by|created by)\s+([^*\n]+)', line, re.IGNORECASE)
                    if earned_match:
                        source = earned_match.group(1).strip()
                        concept.relationships.append((source, "earned_by", "1..*"))
            
            # Check for displays/shows relationships
            elif 'displays' in line.lower() or 'shows' in line.lower():
                display_match = re.search(r'(?:displays|shows)\s+(?:the\s+)?(?:total\s+)?([a-zA-Z\s]+)\s+accumulated', line, re.IGNORECASE)
                if display_match:
                    target = display_match.group(1).strip().capitalize()
                    concept.relationships.append((target, "displays", "1"))
                else:
                    display_match = re.search(r'(?:displays|shows)\s+(?:the\s+)?([^*\n]+)', line, re.IGNORECASE)
                    if display_match:
                        target = display_match.group(1).strip()
                        concept.relationships.append((target, "displays", "1"))
            
            # Otherwise treat as attribute
            else:
                concept.attributes.append(line)
        
        return concept
    
    def generate_mermaid(self) -> str:
        """Generate Mermaid ER diagram from parsed concepts."""
        lines = ["```mermaid", "erDiagram"]

        # Track which relationships we've added to avoid duplicates
        added_relationships: Set[str] = set()

        # Generate relationships first (ER diagrams start with relationships)
        for name, concept in self.concepts.items():
            source_id = self._sanitize_id(name)

            # Handle inheritance
            if concept.parent:
                parent_id = self._sanitize_id(concept.parent)
                rel_key = f"{source_id}-->{parent_id}:inherits"
                if rel_key not in added_relationships:
                    lines.append(f'    {source_id} ||--|| {parent_id} : "is kind of"')
                    added_relationships.add(rel_key)

            # Handle other relationships
            for target, rel_type, cardinality in concept.relationships:
                target_id = self._sanitize_id(target)

                if rel_type == "association":
                    rel_key = f"{source_id}-->{target_id}:assoc"
                    if rel_key not in added_relationships:
                        # Convert cardinality to ER notation
                        er_card = self._convert_cardinality(cardinality)
                        lines.append(f'    {source_id} {er_card} {target_id} : "associated with"')
                        added_relationships.add(rel_key)

                elif rel_type == "composition":
                    rel_key = f"{source_id}-->{target_id}:comp"
                    if rel_key not in added_relationships:
                        er_card = self._convert_cardinality(cardinality)
                        lines.append(f'    {source_id} {er_card} {target_id} : "has"')
                        added_relationships.add(rel_key)

                elif rel_type == "earned_by":
                    # Reverse the relationship direction
                    rel_key = f"{target_id}-->{source_id}:earns"
                    if rel_key not in added_relationships:
                        lines.append(f'    {target_id} ||--o{{ {source_id} : "earns"')
                        added_relationships.add(rel_key)

                elif rel_type == "displays":
                    rel_key = f"{source_id}-->{target_id}:displays"
                    if rel_key not in added_relationships:
                        lines.append(f'    {source_id} ||--|| {target_id} : "displays"')
                        added_relationships.add(rel_key)

        lines.append("")

        # Generate entity definitions with attributes
        for name, concept in self.concepts.items():
            entity_id = self._sanitize_id(name)

            if concept.attributes:
                lines.append(f'    {entity_id} {{')
                for attr in concept.attributes:
                    # Clean up attribute text and add type
                    attr_clean = attr.replace('a ', '').replace('an ', '').rstrip('.')
                    # Replace special characters that aren't allowed in ER attributes
                    attr_clean = attr_clean.replace('.', '').replace(',', '')
                    lines.append(f'        string {attr_clean}')
                lines.append('    }')

        lines.append("```")
        diagram = "\n".join(lines)

        # Add relationship syntax legend as markdown
        legend_lines = [
            "\n## Relationship Syntax Legend\n",
            "- `||--||` : One to exactly one",
            "- `||--o|` : One to zero or one",
            "- `||--o{` : One to many",
            "- `||--|{` : One to one or more"
        ]

        # Generate markdown descriptions section if there are descriptions
        concepts_with_descriptions = [(name, concept) for name, concept in self.concepts.items() if concept.description]

        # Add usage instructions
        usage_note = [
            "\n---",
            "\n**Usage:** Copy this output to a markdown file (.md). With Mermaid and Markdown plugins installed in IntelliJ, the diagram will render perfectly."
        ]

        if concepts_with_descriptions:
            description_lines = ["\n## Ubiquitous Language\n"]
            for name, concept in concepts_with_descriptions:
                description_lines.append(f"- **{name}**: {concept.description}")
            return diagram + "\n".join(legend_lines) + "\n" + "\n".join(description_lines) + "\n".join(usage_note)

        return diagram + "\n".join(legend_lines) + "\n".join(usage_note)

    def _convert_cardinality(self, cardinality: str) -> str:
        """Convert text cardinality to ER diagram notation."""
        cardinality_lower = cardinality.lower().strip()

        # Map common cardinality patterns to ER notation
        # Format: left|right where left is source, right is target
        # || = exactly one, |{ = one or more, o| = zero or one, o{ = zero or more

        if "1 or more" in cardinality_lower or "one or more" in cardinality_lower:
            return "||--o{"  # one-to-many
        elif "0 or more" in cardinality_lower or "zero or more" in cardinality_lower:
            return "||--o{"  # one-to-many (optional)
        elif cardinality_lower == "1":
            return "||--||"  # one-to-one
        elif "0..1" in cardinality_lower:
            return "||--o|"  # one-to-zero-or-one
        else:
            # Default to one-to-many
            return "||--o{"

    def _sanitize_id(self, name: str) -> str:
        """Convert concept name to valid Mermaid node ID."""
        # Remove backticks and special characters, replace spaces with underscores
        sanitized = re.sub(r'[^a-zA-Z0-9_]', '', name.replace(' ', '_'))
        return sanitized


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python generate_concept_map.py <input_file>")
        print("   or: echo 'text' | python generate_concept_map.py -")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    # Read input
    if input_file == '-':
        text = sys.stdin.read()
    else:
        with open(input_file, 'r', encoding='utf-8') as f:
            text = f.read()
    
    # Generate concept map
    generator = ConceptMapGenerator()
    generator.parse_text(text)
    mermaid_code = generator.generate_mermaid()
    
    print(mermaid_code)


if __name__ == '__main__':
    main()
