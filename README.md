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

# path.resolve

1. if we provide a relative path, it uses `__dirname` to find the dir
   of the file and adds the file provided

   `path.resolve(file)` will give `/Users/../../file`

2. if we provide an absolute path, it will use that

   `path.resolve(src/file)` will give `src/file`

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
