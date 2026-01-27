import re
from typing import Dict, List, Tuple
from services.text_preprocessing import TextPreprocessor

class SkillMatcher:
    def __init__(self):
        self.preprocessor = TextPreprocessor()
        
        # Skill categories with weights
        self.skill_weights = {
            'programming_languages': 1.0,
            'frameworks': 0.9,
            'databases': 0.8,
            'cloud_platforms': 0.9,
            'tools': 0.7,
            'soft_skills': 0.6
        }
    
    def analyze_match(self, resume_data: Dict, job_data: Dict) -> Dict:
        """Comprehensive analysis of resume-job match"""
        try:
            # Extract skills from both resume and job
            resume_skills = self._extract_resume_skills(resume_data)
            job_skills = self._extract_job_skills(job_data)
            
            # Perform skill matching
            skill_analysis = self._analyze_skills(resume_skills, job_skills)
            
            # Calculate ATS score
            ats_score = self._calculate_ats_score(resume_data, job_data, skill_analysis)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(skill_analysis, job_data)
            
            return {
                'ats_score': ats_score,
                'skill_analysis': skill_analysis,
                'recommendations': recommendations,
                'match_details': {
                    'total_job_skills': len(job_skills),
                    'matched_skills': len(skill_analysis['matched_skills']),
                    'missing_skills': len(skill_analysis['missing_skills']),
                    'match_percentage': (len(skill_analysis['matched_skills']) / len(job_skills) * 100) if job_skills else 0
                }
            }
            
        except Exception as e:
            return {'error': f'Error in skill matching: {str(e)}'}
    
    def calculate_ats_score(self, resume_data: Dict, job_data: Dict) -> int:
        """Calculate ATS compatibility score (0-100)"""
        try:
            analysis = self.analyze_match(resume_data, job_data)
            return analysis.get('ats_score', 0)
        except Exception as e:
            print(f"Error calculating ATS score: {e}")
            return 0
    
    def analyze_skills(self, resume_data: Dict, job_data: Dict) -> Dict:
        """Analyze skills match between resume and job"""
        try:
            analysis = self.analyze_match(resume_data, job_data)
            return analysis.get('skill_analysis', {})
        except Exception as e:
            print(f"Error analyzing skills: {e}")
            return {}
    
    def _extract_resume_skills(self, resume_data: Dict) -> List[str]:
        """Extract skills from resume data"""
        skills = []
        
        # Get skills from parsed data
        if 'skills' in resume_data:
            skills.extend(resume_data['skills'])
        
        # Extract additional skills from text
        if 'cleaned_text' in resume_data:
            text_skills = self._extract_skills_from_text(resume_data['cleaned_text'])
            skills.extend(text_skills)
        
        # Normalize and deduplicate
        normalized_skills = []
        for skill in skills:
            normalized = self.preprocessor.normalize_skill_name(skill)
            if normalized not in normalized_skills:
                normalized_skills.append(normalized)
        
        return normalized_skills
    
    def _extract_job_skills(self, job_data: Dict) -> List[str]:
        """Extract required skills from job data"""
        skills = []
        
        # Get skills from job requirements
        if 'requiredSkills' in job_data:
            skills.extend(job_data['requiredSkills'])
        
        # Extract skills from job description
        if 'description' in job_data:
            desc_skills = self._extract_skills_from_text(job_data['description'])
            skills.extend(desc_skills)
        
        # Normalize and deduplicate
        normalized_skills = []
        for skill in skills:
            normalized = self.preprocessor.normalize_skill_name(skill)
            if normalized not in normalized_skills:
                normalized_skills.append(normalized)
        
        return normalized_skills
    
    def _extract_skills_from_text(self, text: str) -> List[str]:
        """Extract technical skills from text"""
        if not text:
            return []
        
        # Common technical skills database
        skill_database = [
            # Programming Languages
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'sass', 'less',
            
            # Frameworks & Libraries
            'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
            'rails', 'asp.net', '.net', 'jquery', 'bootstrap', 'tailwind', 'material-ui', 'redux',
            'next.js', 'nuxt.js', 'gatsby', 'svelte', 'ember', 'backbone',
            
            # Databases
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite',
            'cassandra', 'dynamodb', 'firebase', 'mariadb', 'couchdb', 'neo4j',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab',
            'ci/cd', 'terraform', 'ansible', 'nginx', 'apache', 'heroku', 'vercel', 'netlify',
            
            # Tools & Technologies
            'linux', 'unix', 'windows', 'macos', 'bash', 'powershell', 'vim', 'vscode',
            'intellij', 'eclipse', 'postman', 'jira', 'confluence', 'slack', 'trello',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
            'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'tableau', 'power bi',
            'spark', 'hadoop', 'kafka', 'airflow',
            
            # Mobile Development
            'ios', 'android', 'react native', 'flutter', 'xamarin', 'cordova', 'ionic',
            
            # Testing
            'jest', 'mocha', 'chai', 'selenium', 'cypress', 'junit', 'pytest', 'unit testing',
            'integration testing', 'tdd', 'bdd', 'cucumber'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skill_database:
            # Use word boundaries for exact matching
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        
        return found_skills
    
    def _analyze_skills(self, resume_skills: List[str], job_skills: List[str]) -> Dict:
        """Analyze skill overlap and gaps"""
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        job_skills_lower = [skill.lower() for skill in job_skills]
        
        # Find matches (case-insensitive)
        matched_skills = []
        for job_skill in job_skills:
            if job_skill.lower() in resume_skills_lower:
                matched_skills.append(job_skill)
        
        # Find missing skills
        missing_skills = []
        for job_skill in job_skills:
            if job_skill.lower() not in resume_skills_lower:
                missing_skills.append(job_skill)
        
        # Find underrepresented skills (skills that appear but might need more emphasis)
        underrepresented_skills = []
        for skill in matched_skills:
            # This is a simplified check - in a real implementation, 
            # you might analyze frequency of mention
            if len([s for s in resume_skills if s.lower() == skill.lower()]) == 1:
                underrepresented_skills.append(skill)
        
        return {
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'underrepresented_skills': underrepresented_skills,
            'additional_skills': [skill for skill in resume_skills if skill.lower() not in job_skills_lower]
        }
    
    def _calculate_ats_score(self, resume_data: Dict, job_data: Dict, skill_analysis: Dict) -> int:
        """Calculate ATS score based on multiple factors"""
        score = 0
        max_score = 100
        
        # Skill matching (40% of total score)
        skill_score = 0
        total_job_skills = len(skill_analysis['matched_skills']) + len(skill_analysis['missing_skills'])
        if total_job_skills > 0:
            skill_match_ratio = len(skill_analysis['matched_skills']) / total_job_skills
            skill_score = skill_match_ratio * 40
        
        # Keyword density in resume (20% of total score)
        keyword_score = self._calculate_keyword_score(resume_data, job_data) * 20
        
        # Experience relevance (20% of total score)
        experience_score = self._calculate_experience_score(resume_data, job_data) * 20
        
        # Education relevance (10% of total score)
        education_score = self._calculate_education_score(resume_data, job_data) * 10
        
        # Resume structure and completeness (10% of total score)
        structure_score = self._calculate_structure_score(resume_data) * 10
        
        total_score = skill_score + keyword_score + experience_score + education_score + structure_score
        
        return min(int(total_score), max_score)
    
    def _calculate_keyword_score(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate score based on keyword matching"""
        if 'cleaned_text' not in resume_data or 'description' not in job_data:
            return 0.0
        
        resume_text = resume_data['cleaned_text']
        job_text = job_data['description']
        
        return self.preprocessor.similarity_score(resume_text, job_text)
    
    def _calculate_experience_score(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate score based on experience match"""
        # Simplified experience scoring
        if 'experience' in resume_data:
            experience_text = resume_data['experience']
            if 'senior' in experience_text.lower() or 'lead' in experience_text.lower():
                return 0.8
            elif any(year in experience_text for year in ['3', '4', '5']):
                return 0.6
            elif any(year in experience_text for year in ['1', '2']):
                return 0.4
        
        return 0.3  # Default score
    
    def _calculate_education_score(self, resume_data: Dict, job_data: Dict) -> float:
        """Calculate score based on education relevance"""
        if 'education' not in resume_data:
            return 0.5  # Neutral score if no education info
        
        education = resume_data['education']
        relevant_fields = ['computer science', 'software engineering', 'information technology']
        
        for field in relevant_fields:
            if any(field in edu.lower() for edu in education):
                return 0.8
        
        return 0.6  # General education score
    
    def _calculate_structure_score(self, resume_data: Dict) -> float:
        """Calculate score based on resume structure and completeness"""
        score = 0.0
        
        # Check for essential sections
        if 'sections' in resume_data:
            sections = resume_data['sections']
            essential_sections = ['experience', 'skills', 'education']
            
            for section in essential_sections:
                if sections.get(section, False):
                    score += 0.25
        
        # Check for contact information
        if 'contact_info' in resume_data:
            contact = resume_data['contact_info']
            if 'email' in contact:
                score += 0.125
            if 'phone' in contact:
                score += 0.125
        
        return min(score, 1.0)
    
    def _generate_recommendations(self, skill_analysis: Dict, job_data: Dict) -> List[str]:
        """Generate recommendations for improving resume"""
        recommendations = []
        
        missing_skills = skill_analysis.get('missing_skills', [])
        underrepresented_skills = skill_analysis.get('underrepresented_skills', [])
        
        # Recommendations for missing skills
        if missing_skills:
            high_priority_skills = missing_skills[:3]  # Top 3 missing skills
            for skill in high_priority_skills:
                recommendations.append(f"Add {skill} to your technical skills section and provide specific examples of projects where you used it.")
        
        # Recommendations for underrepresented skills
        if underrepresented_skills:
            for skill in underrepresented_skills[:2]:  # Top 2 underrepresented
                recommendations.append(f"Mention {skill} more prominently in your work experience and highlight specific achievements using this technology.")
        
        # General recommendations
        if len(skill_analysis.get('matched_skills', [])) < 3:
            recommendations.append("Consider gaining experience in the key technologies mentioned in the job description.")
        
        if not recommendations:
            recommendations.append("Your resume shows good alignment with the job requirements. Consider adding specific metrics and achievements to strengthen your profile.")
        
        return recommendations[:5]  # Limit to 5 recommendations