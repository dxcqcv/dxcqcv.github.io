---
layout: post
title: do not use arrow function to custom methods in mongoose
tags:
- ES6
- mongoose
excerpt: when you use arrow function to custom methods in mongoose you will get this reference bugs.
---

This bug is about this reference, so let me show code to you

```javascript
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000,64, 'sha512').toString('hex');
};
```

In this case, `this` will refer to `setPassword` method, but userSchema, so you just have two ways can fix it

1. pass `userSchema` to function
2. using normal function(not arrow function)

to pass `userSchema` in everywhere is too inconvenient, so just use normal function to fix it, and thank ECMA.
