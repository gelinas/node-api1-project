// implement your API here

const express = require('express');
const db = require('./data/db.js');
const cors = require('cors')

const server = express();

// middleware
server.use(cors());

server.use(express.json());

// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                                              |

server.post('/users', (req, res) => {
    const userInformation = req.body;

    // console.log('user information', userInformation);
    // console.log('request', req);

    if (!userInformation.name || !userInformation.bio) {
        res.status(400).json({ error: 'Please provide name and bio for the user.' });
    }

    db.insert(userInformation)
        .then(newUserId => {
            res.status(201).json(newUserId);
        })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ error: 'There was an error while saving the user to the database.' });
        });
});

// | GET    | /              | Return test message

server.get('/', (req, res) => {
    // console.log("test");
    res.status(200).json("Server is alive");
})

// | GET    | /api/users     | Returns an array of all the user objects contained in the database.                                                               |

server.get('/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ errpr: 'The users information could not be retrieved.'});
        });
});

// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                                                  |

server.get('/users/:id', (req, res) => {
    const { id } = req.params;
    // console.log(id)
    db.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'The user with the specified ID does not exist.' })
            } else {
                res.status(200).json(user)
            };
        })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ error: 'The users information could not be retrieved.'})
        });
});

// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                                            |

server.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ error: 'The users information could not be retrieved.'})
        });

    db.remove(id)
        .then(user => {
            res.status(200).json({ message: `The user with ID ${id} has been deleted.`})
        })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ error: "Failed to add the user to the database." });
        });
});

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. |

server.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const userInformation = req.body;

    db.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ error: 'The users information could not be retrieved.'})
        });

    if (!userInformation.name || !userInformation.bio) {
        res.status(400).json({ error: 'Please provide name and bio for the user.' });
    }

    db.update(id, userInformation)
        .then(user => {
            res.status(200).json({ message: `Inserted user into the databse.`, user: userInformation })
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be modified" })
        })
})

const port = 8000; // localhost:8000
server.listen(port, () => console.log('\n=== API on port 8000 ===\n'));