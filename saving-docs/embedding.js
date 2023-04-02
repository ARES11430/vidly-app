const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: {
      type: [authorSchema],
      required: true,
    },
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function listAuthors() {
  const authors = await Author.find();
  console.log(authors);
}

async function updateAuthor(courseId) {
  const course = await Course.findByIdAndUpdate(
    { _id: courseId },
    {
      $set: {
        "author.name": "Amin Ghasemi",
      },
    },
    { new: true }
  );
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  await course.save();
}

/* createCourse("Node Course", [
  new Author({ name: "Mosh" }),
  new Author({ name: "Amin" }),
]); */

//updateAuthor("641de9f7e4c9cbbc85b9024a");

// addAuthor("641dee3b365d957b001256d8", new Author({ name: "Amy" }));

listAuthors();
