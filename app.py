from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__)  # This is the correct line

# Load internship data
with open('internships.json', 'r') as f:
    internships = json.load(f)

# ... (rest of your code)

@app.route('/')
def home():
    """Serves the main HTML file for the chatbot UI."""
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    """Endpoint for generating and returning internship recommendations."""
    user_data = request.json
    education = user_data.get('education')
    skills = user_data.get('skills', [])  # It can be a list if multiple are selected
    sector = user_data.get('sector_interest')
    location = user_data.get('location')

    ranked_internships = []
    for internship in internships:
        score = 0
        
        # Rule 1: Education Match (e.g., Undergraduate is 100% match)
        if education and education.lower() == internship['education_level'].lower():
            score += 2
        
        # Rule 2: Skills Match (1 point per matching skill)
        for user_skill in skills:
            if user_skill.lower() in [s.lower() for s in internship['skills']]:
                score += 1.5
        
        # Rule 3: Sector Match (e.g., a perfect match is a high priority)
        if sector and sector.lower() == internship['sector'].lower():
            score += 3
        
        # Rule 4: Location Preference
        if location and location.lower() in internship['location'].lower() or "anywhere in india" in internship['location'].lower():
            score += 2
            
        ranked_internships.append({'internship': internship, 'score': score})

    # Sort by score in descending order and get top 3-5
    ranked_internships.sort(key=lambda x: x['score'], reverse=True)
    
    # Filter out recommendations with a score of 0, as they are not a good fit
    top_recommendations = [item['internship'] for item in ranked_internships if item['score'] > 0][:5]

    return jsonify(top_recommendations)

if __name__ == '__main__':
    # Running the app locally
    app.run(debug=True)