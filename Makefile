build: readmes
	grunt build

readmes:
	grunt readmes:github
	grunt readmes

clean:
	grunt clean

deploy: readmes
	grunt deploy