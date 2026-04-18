import os
import re
from PyPDF2 import PdfReader
from docx import Document
from services.text_preprocessing import TextPreprocessor

class ResumeParser:
    def __init__(self):
        self.preprocessor = TextPreprocessor()
    
    def parse_resume(self, file_path):
        """Parse resume and extract relevant information"""
        try:
            # Extract text based on file type
            text = self._extract_text(file_path)
            
            if not text:
                return {'error': 'Could not extract text from resume'}
            
            # Clean and preprocess text
            cleaned_text = self.preprocessor.clean_text(text)
            
            # Extract information
            resume_data = {
                'raw_text': text,
                'cleaned_text': cleaned_text,
                'skills': self._extract_skills(cleaned_text),
                'experience': self._extract_experience(cleaned_text),
                'education': self._extract_education(cleaned_text),
                'contact_info': self._extract_contact_info(text),
                'sections': self._identify_sections(text)
            }
            
            return resume_data
            
        except Exception as e:
            return {'error': f'Error parsing resume: {str(e)}'}
    
    def _extract_text(self, file_path):
        """Extract text from PDF or DOCX file"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_extension == '.pdf':
                return self._extract_from_pdf(file_path)
            elif file_extension in ['.doc', '.docx']:
                return self._extract_from_docx(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
        except Exception as e:
            print(f"Error extracting text: {e}")
            return ""
    
    def _extract_from_pdf(self, file_path):
        """Extract text from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text
    
    def _extract_from_docx(self, file_path):
        """Extract text from DOCX file"""
        text = ""
        try:
            doc = Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
        return text
    
    def _extract_skills(self, text):
        """Extract technical skills from resume text"""
        # Common technical skills (this should be expanded)
        skill_keywords = [
            # Programming Languages
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'sass', 'less',
            
            # Frameworks & Libraries
            'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
            'rails', 'asp.net', '.net', 'jquery', 'bootstrap', 'tailwind', 'material-ui',
            
            # Databases
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite',
            'cassandra', 'dynamodb', 'firebase',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab',
            'ci/cd', 'terraform', 'ansible', 'nginx', 'apache',
            
            # Tools & Technologies
            'linux', 'unix', 'windows', 'macos', 'bash', 'powershell', 'vim', 'vscode',
            'intellij', 'eclipse', 'postman', 'jira', 'confluence', 'slack',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
            'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'tableau', 'power bi',
            
            # Mobile Development
            'ios', 'android', 'react native', 'flutter', 'xamarin', 'cordova', 'ionic',
            
            # Testing
            'jest', 'mocha', 'chai', 'selenium', 'cypress', 'junit', 'pytest', 'unit testing',
            'integration testing', 'tdd', 'bdd'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skill_keywords:
            if skill.lower() in text_lower:
                # Check for word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.append(skill.title())
        
        return list(set(found_skills))  # Remove duplicates
    
    def _extract_experience(self, text):
        """Extract work experience information"""
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'experience\s*:?\s*(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s*in\s*\w+',
            r'over\s*(\d+)\+?\s*years?',
            r'more\s*than\s*(\d+)\+?\s*years?'
        ]
        
        text_lower = text.lower()
        for pattern in experience_patterns:
            match = re.search(pattern, text_lower)
            if match:
                return f"{match.group(1)} years"
        
        return "Not specified"
    
    def _extract_education(self, text):
        """Extract education information"""
        education_keywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'diploma', 'certificate',
            'b.tech', 'b.e', 'm.tech', 'm.e', 'mba', 'bca', 'mca',
            'computer science', 'information technology', 'software engineering',
            'electrical engineering', 'mechanical engineering', 'civil engineering'
        ]
        
        found_education = []
        text_lower = text.lower()
        
        for edu in education_keywords:
            if edu.lower() in text_lower:
                found_education.append(edu.title())
        
        return list(set(found_education))
    
    def _extract_contact_info(self, text):
        """Extract contact information"""
        contact_info = {}
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact_info['email'] = email_match.group()
        
        # Phone pattern
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            contact_info['phone'] = phone_match.group()
        
        return contact_info
    
    def _identify_sections(self, text):
        """Identify different sections in the resume"""
        sections = {}
        
        section_patterns = {
            'summary': r'(summary|profile|objective)',
            'experience': r'(experience|work history|employment)',
            'education': r'(education|academic|qualification)',
            'skills': r'(skills|technical skills|competencies)',
            'projects': r'(projects|portfolio)',
            'certifications': r'(certifications|certificates|licenses)'
        }
        
        text_lower = text.lower()
        for section, pattern in section_patterns.items():
            if re.search(pattern, text_lower):
                sections[section] = True
            else:
                sections[section] = False
        
        return sections