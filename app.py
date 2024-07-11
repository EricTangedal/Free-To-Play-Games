# app.py
from flask import Flask, jsonify, render_template, request
import pandas as pd

app = Flask(__name__)

# Load data
df = pd.read_csv('data/free-to-play-games.csv')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/games', methods=['GET'])
def get_games():
    # Get query parameters
    search = request.args.get('search', '')
    genre = request.args.get('genre', '')
    platform = request.args.get('platform', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))

    # Filter data
    filtered_df = df
    if search:
        filtered_df = filtered_df[filtered_df['title'].str.contains(search, case=False)]
    if genre:
        filtered_df = filtered_df[filtered_df['genre'] == genre]
    if platform:
        filtered_df = filtered_df[filtered_df['platform'] == platform]

    # Pagination
    total = len(filtered_df)
    start = (page - 1) * per_page
    end = start + per_page
    games = filtered_df.iloc[start:end].to_dict(orient='records')

    return jsonify({
        'games': games,
        'total': total,
        'page': page,
        'per_page': per_page
    })

if __name__ == '__main__':
    app.run(debug=True)
