const crypto = require('crypto');


/*
  API

  SaltedHash takes a string then salts and hashes it.
  This module is intended for use with password storage.

  SaltedHash takes an object with the following properties and values:
  {
    alg:         (string)           The hashing algorithm to use.
    salt_length: (Number)           Length of the salt to use.
    data:        (string || buffer) Data to salt and hash.
    encoding:    (string)           Encoding to use for data. No effect if data is a buffer.
  }
  Or a string:
  The string must be the toString() representation of a SaltedHash Object.

  SaltedHash supports these methods:

  function toString():
    Returns a JSON string of alg, salt_length, salt, and hash.

  function check(data (string)):
    Returns true if data is the same as the original data, False otherwise.
 */

function SaltedHash(arg)
{
    if (arguments.length !== 1)
    {
        throw Error("Invalid number of arguments");
    }

    if (typeof arg !== 'string' && typeof arg !== 'object')
    {
        throw Error('Argument must be object or string');
    }

    // Existing SaltedHash Parser
    if (typeof arg === 'string')
    {
        let shash = JSON.parse(arg);
        this.alg = shash.alg;
        this.salt = Buffer.from(shash.salt, 'base64');
        this.hash = Buffer.from(shash.hash, 'base64');
    }
    // New SaltedHash Parser
    else
    {

        // alg parser
        if (typeof arg.alg === 'string') {
            this.alg = arg.alg;
        }
        else if (typeof arg.alg === 'undefined')
        {
            // default
            this.alg = 'sha256';
        }
        else
        {
            throw Error("alg must be a string or undefined");
        }


        // salt_length parser
        if (typeof arg.salt_length === 'number') {
            let length = Math.floor(arg.salt_length);
            if (length >= 0)
            {
                this.salt = crypto.randomBytes(length);
            }
            else
            {
                throw Error("salt_length must be greater than or equal to 0");
            }
        }
        else if (typeof arg.salt_length === 'undefined')
        {
            // default
            this.salt = crypto.randomBytes(32);
        }
        else
        {
            throw Error("salt_length must be a number or undefined");
        }



        // data parser
        // DO NOT STORE arg.data
        let data;
        if (Buffer.isBuffer(arg.data)) {
            data = arg.data;
        }
        else if (typeof arg.data === 'string')
        {
            let encoding = 'utf-8';

            if (typeof arg.encoding === 'string')
            {
                encoding = arg.encoding;
            }

            data = Buffer.from(arg.data, encoding);
        }
        else
        {
            throw Error('data must be a string');
        }

        this.hash = crypto.createHash(this.alg)
            .update(this.salt)
            .update(data)
            .digest();
    }


    this.toString = function() {
        return JSON.stringify({alg: this.alg,
                salt: this.salt.toString('base64'),
                hash: this.hash.toString('base64')});
    };


    this.check = function(data, encoding) {
        if (typeof data !== 'string') throw Error("data must be a string");

        if (typeof encoding !== 'string' &&
            typeof encoding !== 'undefined')
            throw Error("encoding must be a string if specified");

        if (crypto.createHash(this.alg)
            .update(this.salt)
            .update(data, encoding || 'utf-8')
            .digest()
            .compare(this.hash) == 0) return true;
        else return false;
    };
}

module.export = SaltedHash;


// Only ran when file is executed as main
if (require.main === module)
{
    console.log("Creating new shash...");
    // Create new shash
    var newAccount = new SaltedHash({data: "password", salt_length: 16, alg: 'sha256'});
    console.log(newAccount.toString());

    console.log();
    console.log("Expected output: true");
    console.log("Actual output: %s", newAccount.check('password'));

    console.log();
    console.log("Expected output: false");
    console.log("Actual output: %s", newAccount.check('wrong'));


    console.log();
    console.log("Creating shash from an existing shash string...");

    // Verify password against existing shash
    var existingAccount = new SaltedHash(newAccount.toString());
    console.log(existingAccount.toString());

    console.log();
    console.log("Expected output: true");
    console.log("Actual output: %s", existingAccount.check('password'));

    console.log();
    console.log("Expected output: false");
    console.log("Actual output: %s", existingAccount.check('wrong'));
}
