import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "BeyondChats",
    },

    publishedDate: {
      type: Date,
    },

    sourceUrl: {
      type: String,
      required: true,
      unique: true,
    },

    isUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
