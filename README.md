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
    et gzipStream = zlib.createGzip()
    outStream = outStream.pipe(gzipStream)
```
