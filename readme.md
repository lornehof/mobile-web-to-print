# mobile-web-to-print

---------------

Project demonstrates a mobile friendly web-to-print workflow 

	(a) web folder contains a web rendering of a schedule

	(b) indesign folder contains a script that generates a print ready version of same schedule

---------------

RUN DEMO:

(a) Website

	 1. Run simple python server from "web" folder: python -m SimpleHTTPServer 8000

	 2. User browser to view: localhost:8000

(b) InDesign

	 1. Install InDesign CS6

	 2. If running on Mac, from "indesign" folder execute following in terminal: ./run.sh

	 3. If running on Windows, place "indesign" folder and its contents in the "scripts" folder contained within the InDesign CS6 application. Start InDesign and execute program.jsx from the scripts panel.  