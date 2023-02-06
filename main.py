import random
from fuzzywuzzy import fuzz
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

words = ['on', 'us', 'as', 'my', 'we', 'ex', 'so', 'to', 'no', 'do', 'or', 'go', 'by', 'he', 'an', 'is', 'at', 'of',
         'up', 'me', 'use', 'ego', 'log', 'day', 'man', 'ask', 'bee', 'sea', 'rib', 'hot', 'far', 'pit', 'key', 'eye',
         'arm', 'hay', 'pie', 'shy', 'bar', 'bay', 'name', 'lion', 'tree', 'nest', 'last', 'left', 'lazy', 'pest',
         'nail', 'stun', 'gift', 'disk', 'loop', 'clue', 'inch', 'lack', 'toll', 'cope', 'heir', 'coat', 'jelly',
         'index', 'amuse', 'toast', 'guest', 'slump', 'sleep', 'treat', 'brick', 'bless', 'flock', 'glove', 'noble',
         'blame', 'elbow', 'exile', 'ratio', 'gaffe', 'brake', 'beach', 'expect', 'chance', 'degree', 'series',
         'dinner', 'coerce', 'kettle', 'belief', 'morsel', 'ensure', 'public', 'normal', 'exceed', 'slogan', 'gutter',
         'change', 'unlike', 'tycoon', 'bishop', 'buffet', 'sunrise', 'pudding', 'silence', 'terrify', 'prosper',
         'realism', 'compete', 'dentist', 'sausage', 'endorse', 'costume', 'passive', 'passion', 'stomach', 'funeral',
         'concede', 'mention', 'feeling', 'alcohol', 'reserve', 'misplace', 'dominant', 'farewell', 'humanity',
         'addition', 'withdraw', 'judicial', 'ceremony', 'champion', 'employee', 'workshop', 'elephant', 'disagree',
         'compound', 'response', 'struggle', 'conceive', 'industry', 'cucumber', 'orthodox']


@app.route("/receive_data", methods=['POST'])
def receive_data():
    data = request.get_json()
    elapsed_time = float(data['time'])
    user_input = ' '.join(data['user'])
    test_text = ' '.join(data['test'])
    keys_pressed = len(user_input)
    accuracy = fuzz.ratio(user_input, test_text)
    try:
        words_per_min = round(((keys_pressed / 5) / (elapsed_time / 60)), 2)
        results = {
            'values': f'Time: {elapsed_time} seconds<br />Words per Minute: {words_per_min}<br />Accuracy: {accuracy}%'}
        return jsonify(results)
    except ZeroDivisionError:
        pass
        return ''


@app.route('/', methods=['GET', 'POST'])
def homepage():
    word_display, word_list = generate_words()
    return render_template('index.html', words=word_display)


def generate_words():
    word_list = random.choices(words, k=20)
    word_display = ' '.join(word_list)
    return word_display, word_list


if __name__ == '__main__':
    app.run(debug=True, port=8000)
