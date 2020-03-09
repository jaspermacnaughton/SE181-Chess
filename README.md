# SE181-Chess

# Running in development mode
Ensure you've run `npm install` in both client/ and server/, run the two commands simultaneously
- Run `npm start` in server/
- Run `ng serve --proxy-config proxy.conf.json` in client/


# Running Tests
-   Run `cd server/`
-   Run `node_modules/mocha/bin/mocha`
To find code coverage you can run
-   `npm test`


# Static Analysis
-   Run `cd server/`
-   Run `node_modules/jshint/bin/jshint --verbose src/
Any issues will be displayed, if nothing is found output will be empty (Not sure how to force an output)


