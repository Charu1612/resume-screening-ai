import re
import string
from typing import List, Dict

class TextPreprocessor:
    def __init__(self):
        self.stop_words = {
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
            'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how', 'their',
            'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some',
            'her', 'would', 'make', 'like', 'into', 'him', 'time', 'two', 'more',
            'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call',
            'who', 'oil', 'sit', 'now', 'find', 'down', 'day', 'did', 'get',
            'come', 'made', 'may', 'part'
        }
    
    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace and newlines
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep alphanumeric and common punctuation
        text = re.sub(r'[^\w\s\-\.\,\(\)]', ' ', text)
        
        # Remove multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    def extract_keywords(self, text: str, min_length: int = 2) -> List[str]:
        """Extract keywords from text"""
        if not text:
            return []
        
        # Clean text
        cleaned_text = self.clean_text(text)
        
        # Split into words
        words = cleaned_text.split()
        
        # Filter words
        keywords = []
        for word in words:
            # Remove punctuation
            word = word.strip(string.punctuation)
            
            # Skip if too short, is stop word, or is numeric
            if (len(word) >= min_length and 
                word.lower() not in self.stop_words and 
                not word.isdigit()):
                keywords.append(word.lower())
        
        return list(set(keywords))  # Remove duplicates
    
    def calculate_keyword_frequency(self, text: str) -> Dict[str, int]:
        """Calculate frequency of keywords in text"""
        keywords = self.extract_keywords(text)
        frequency = {}
        
        text_lower = text.lower()
        for keyword in keywords:
            # Count occurrences using word boundaries
            pattern = r'\b' + re.escape(keyword) + r'\b'
            count = len(re.findall(pattern, text_lower))
            if count > 0:
                frequency[keyword] = count
        
        return frequency
    
    def extract_phrases(self, text: str, phrase_length: int = 2) -> List[str]:
        """Extract n-gram phrases from text"""
        if not text:
            return []
        
        words = self.extract_keywords(text)
        phrases = []
        
        for i in range(len(words) - phrase_length + 1):
            phrase = ' '.join(words[i:i + phrase_length])
            phrases.append(phrase)
        
        return phrases
    
    def normalize_skill_name(self, skill: str) -> str:
        """Normalize skill names for better matching"""
        skill = skill.lower().strip()
        
        # Common normalizations
        normalizations = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'c++': 'cpp',
            'c#': 'csharp',
            'node': 'node.js',
            'nodejs': 'node.js',
            'reactjs': 'react',
            'vuejs': 'vue',
            'angularjs': 'angular',
            'postgresql': 'postgres',
            'mysql': 'mysql',
            'mongodb': 'mongo',
            'aws': 'amazon web services',
            'gcp': 'google cloud platform',
            'k8s': 'kubernetes'
        }
        
        return normalizations.get(skill, skill)
    
    def extract_technical_terms(self, text: str) -> List[str]:
        """Extract technical terms and acronyms"""
        if not text:
            return []
        
        # Pattern for technical terms (usually capitalized or contain dots/hyphens)
        technical_patterns = [
            r'\b[A-Z]{2,}\b',  # Acronyms (AWS, API, etc.)
            r'\b[A-Za-z]+\.[A-Za-z]+\b',  # Dotted terms (Node.js, etc.)
            r'\b[A-Za-z]+-[A-Za-z]+\b',  # Hyphenated terms
            r'\b[A-Z][a-z]+[A-Z][a-z]*\b'  # CamelCase terms
        ]
        
        technical_terms = []
        for pattern in technical_patterns:
            matches = re.findall(pattern, text)
            technical_terms.extend(matches)
        
        return list(set(technical_terms))
    
    def similarity_score(self, text1: str, text2: str) -> float:
        """Calculate similarity score between two texts based on common keywords"""
        if not text1 or not text2:
            return 0.0
        
        keywords1 = set(self.extract_keywords(text1))
        keywords2 = set(self.extract_keywords(text2))
        
        if not keywords1 or not keywords2:
            return 0.0
        
        # Jaccard similarity
        intersection = keywords1.intersection(keywords2)
        union = keywords1.union(keywords2)
        
        return len(intersection) / len(union) if union else 0.0