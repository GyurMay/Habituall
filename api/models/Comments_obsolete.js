const mongoose = require("mongoose");

const Comments = new mongoose.Schema({
    noteId: {
        type: string,
        required: true
    },
	comments: [
		{ uid: string, comment: string }
	]
});

export default Comments;