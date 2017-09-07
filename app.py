from chatterbot import ChatBot
from flask import Flask
import yaml
app = Flask(__name__)
# Uncomment the following lines to enable verbose logging
# import logging
# logging.basicConfig(level=logging.INFO)

chatbot = ChatBot(
    'Terminal',
    database='./database/db.sqlite3',
    trainer='chatterbot.trainers.ListTrainer',
    logic_adapters=[
        "chatterbot.logic.BestMatch"
    ]
)

with open("fraisercrane.yml", 'r') as stream:
    str_data = stream.read()
    out = yaml.load(str_data)
    print(out['conversations'][1])
    # flatten array
    flat_list = [item for sublist in out['conversations'] for item in sublist]
    # chatbot.train(flat_list)

# Train based on the english corpus
# chatbot.train("chatterbot.corpus.english")

# Get a response to an input statement
print(chatbot.get_response("Hello Frasier"))

@app.route("/")
def response():
    bot_response = chatbot.get_response('I would like to book a flight.')
    return str(bot_response)


if __name__ == "__main__":
	app.run()
