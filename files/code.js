var query = {
type: 'Software Engineer',
gpa: { $gte: 3.95 },
qualities: ['Creative', 'Persistent', 'Reliable']
};

var callback = function(err, candidate) {
assert.equal(candidate.name.first, 'Austin');
assert.equal(candidate.name.last, 'Malerba');
};

models.Candidate.findOne(query, 'name', callback);
