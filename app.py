from chatterbot import ChatBot
from flask import Flask, jsonify, request
import yaml
app = Flask(__name__)
# Uncomment the following lines to enable verbose logging
# import logging
# logging.basicConfig(level=logging.INFO)

chatbot = ChatBot(
    'Terminal',
    storage_adapter="chatterbot.storage.MongoDatabaseAdapter",
    trainer='chatterbot.trainers.ListTrainer',
    logic_adapters=[
        "chatterbot.logic.BestMatch"
    ],
    database_uri="mongodb://thielcole:GbQkNXHzEv3De683@cluster0-shard-00-00-svwvf.mongodb.net:27017,cluster0-shard-00-01-svwvf.mongodb.net:27017,cluster0-shard-00-02-svwvf.mongodb.net:27017/frasier?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
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

@app.route('/prediction', methods=['POST', 'GET'])
def prediction():
    bot_response = str(chatbot.get_response(str(request.json['message'])))
    return jsonify(bot_response)

if __name__ == "__main__":
	app.run()
