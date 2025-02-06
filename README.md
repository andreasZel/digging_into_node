# I/O in Node

## stdout

node provides wrapper functions that let's us use the I/O
streams of our machine.

Streams are the way of input and output data to our system,
C uses stdout and in as a wrapper to the POSIX streams. In
the same manner Node uses:

```Javascript
 process.stdout.write("Hello")
```

to write into the streams, `console.log()`, does not do the
same thing, it actually converts data to binary buffers and
then logs it to our console because the stream handles binary
data more efficiently.

## stderr

`console.error()` writes to a different stream rather than the same
as `console.log()`. We can see that when redirectiong the stream output

1.  for `console.error()`: node ex1.js 2> /dev/null
2.  for `console.log()`: node ex1.js 1> /dev/null

we can do both with node ex1.js 2> /dev/null 1> &2 (the adress that we redirect err)

# interpretation of scripts

If we add a shebang or hashbang on top of the script we tell how to interpreter the
script. We add `#!/usr/bin/env node` which basically finds node in pc.

Now if the script has a executable permission, we can just run it with `./ex1.js` rather
than `node ex1.js`.

# Accessing Input

We can access input with `process.argv`. First two args are node and file dirs, so we can
slice those to those we want

```Javascript
 process.argv.slice(2)
```

We use `miniminst` module that has some build in tools. We import it as:

```Javascript
 var args = require("minimist")(process.argv.slice(2));
```

and we can pass key value pairs like:

```bash
 ./ex1.js --hello=world -c9
```

this means hello = world and c = 9

we can pass some configs that tells the input type

```Javascript
var args = require("minimist")(process.argv.slice(2), {
  boolean: [help],
  string: [file]
});
```

this will always treats `help` as `boolean`

# path

## path.resolve

1. if we provide a relative path, it uses `__dirname` to find the dir
   of the file and adds the file provided

   `path.resolve(file)` will give `/Users/../../file`

2. if we provide an absolute path, it will use that

   `path.resolve(src/file)` will give `src/file`

## path.join

will take any number of input and use the correct seperator according
to our OS

# fs

we can use `fs` to wait and read a file with `fs.readFileSync(filepath)`
the output will be a binary buffer

to view the file we can:

```Javascript
    var contents = fs.readFileSync(filepath);
    process.stdout.write(contents);
```

or just say the encoding as a second parameter

```Javascript
    var contents = fs.readFileSync(filepath, 'utf-8');
    console.log(contents);
```

fs methods have a optional err parameter, if we read the file async
we pass a callback that takes an error and the contents of the file when ended

```Javascript

fs.readFile(filepath, function onContents(error, contents) {
        if (err) {
            error(err.toString());
        } else {

            process.stdout.write(contents);
        }
    });

```

# Stdin

Because stdin is more tedious than stdout, we can use a package to collect the input stream
`get-stdin` we can pass arguments in the stdin to our node script with:

```bash
 cat file.txt | ./test.js
```

# Environmental variables

We can pass env variables to our node script with `VARIABLE=VALUE ./test.js` and
then access the value with `process.env.VARIABLE`

# Node streams

1. simple stream
   can either read or write
   1.1. readable stream
   1.2. writable stream

2. duplex stream
   can read and write

## Connecting streams

If we have a readable and a writable stream and we want to pass the info
from the readable to writable we use `pipe()`:

```Javascript
  var readable_stream;
  var writable_stream;

  const stream3 = readable_stream.pipe(writable_stream)
```

it's like connecting a water hose to a faucet, only availabe to readable streams

what is return is a `stream!`, so we can chain streams

```Javascript
  const stream5; // writable stream
  const stream3 = readable_stream.pipe(readable_stream) // stream3 is readable, so we can pipe it
  const stream6 = stream3.pipe(stream5)

  // equivalent to

  const stream6 = readable_stream
                  .pipe(readable_stream)
                  .pipe(stream5)
```

So in the same way we outputed content from out input stream as text we can output them as streams

```Javascript
var inputStream = process.stdin; // readable stream
var outputStream = process.stdout; // writable stream

const resultStream = inputStream.pipe(outputStream);

// logs the content of input stream
```

The advantage of this method is that we do not convert the whole file or input into a Buffer
and then convert it to String, but we read it in chunks, not all data in memory

## Creating streams

we create streams using `fs` with

1. `fs.createReadStream(path)` : for readable
2. `fs.createWriteStream(path)` " for writable

### Inbetween streams with Transform

We can add an inbetween step to each chunck recieved from inputstream with `Transform`.
We create inbetween stream with:

```Javascript
var uppserStream = new Transform({
        transform(chunck, enc, next) {
            // do stuff with chuncks
            next(); // return function when it finishes
        }
    })
```

the Transform takes by default a `transform` function with

1. `chunck`: the current chunk
2. `enc`: encoding used
3. `next`: function to indicate finish of processing

# Compressing and decompressing

we can use the built in `zlib`. We create a zlib stream and
just pipe the readable stream into it:

```Javascript
    let gzipStream = zlib.createGzip()
    outStream = outStream.pipe(gzipStream)
```

we can do the same with `createGunzip()` to unzip:

```Javascript
    let gunzipstream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipstream)
```

# Listening to Stream Events

## end

we can listen to an `end` event to know when a stream is finished being
processed

we do this as:

```Javascript
    stream.on('end', callback);
```

so we could make a wrapper that takes a readable stream as input and returns
a promise

```Javascript
function streamComplete() {
    return new Promise(function c(res) {
        stream.on('end', res);

    })
}

// use case
const stream = stream.pipe(tagetStream)

await streamComplete(stream);
```

## Cancel a stream process with Cancellation Token

we stop the processing of a stream using:

1. `readableStream.unpipe(writableStream)` : stops the piping of the stream
2. `readableStream.destroy()` : chains an event that stops the processing of the streams and any
   streams attached to it

We could cancel a stream process after a time has passed with `CAF` a npm package.
This package takes a `Generator function` and basically makes it so it can utilize
`CAF.timeout(time, ''message')`:

```Javascript

let signal = CAF.timeout(20, 'Took too long');

function* processFile(signal) {
    signal.pr.catch(function f() {
        // do cleanup
    });

    yield someOtherFunction();
}

processFile = CAF(processFile);

```

# SQLite3

it does not require a seperate database program running on the system, it's a strip down
envirable where the file is maintain directly by our application, it keeps it in binary format
in the system. It's built in in browser.

## create a db

we create a db with `var myDB = new sqlite3.Database(DB_PATH);`

## Queries

we exwcute queries using out dB object with:

1. `.get()` : for SELECT
2. `all()`
3. `exec()` :
4. `run()` : for INSERT

### return valuer from queries

some usefull return values are:

1. `result.lastID` form an insert
2. `result.id` from a get
3. `result.changes` from a insert

# Built in util.promisify

you can take a function that works with callbacks and transform it to promisese with
`util.promisify()`, it returns a function with a promise.

# Create server with http

we create a server using `http` module with:

```Javascript
var httpserv = http.createServer(async function(req, res){

});

 httpserv.listen(PORT)
```

`req` and `res` are streams, so we can do manipulation as with regular streams

## response stream methods

1. `response`
   1.1. `writeHead(statusCode, headers)` : writes into the stream header
   1.2. `end(response?)` : ends the res stream

2. `request`
   2.1. `url` : the url of the request

### Serving static files

we can use the `node-static-alias` package that handles req for us

```Javascript

var fileServer = new staticAlias.Server(WEB_PATH, {
   cache: 100,
   serverInfo: "Node Workshop: ex5",
   alias: [
       {
           match: /^\/(?:index\/?)?(?:[?#].*$)?$/,
           serve: "index.html",
           force: true,
       },
   ],
});

http.createServer((req, res) => {
    fileserver.serve(req, res);
})
```

if we also want to handle request as routes for an api, we simply add
a if statement handling a `req.url`

# Express.js

Express provides a handler for request, ypu create it with

```Javascript
var app = express();
```

to define routes we define a `middleware`, a function that
gets called when an endpoint is called with `app.get('/route', (req, res) => {})`
