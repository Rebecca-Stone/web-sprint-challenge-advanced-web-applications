import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PT from "prop-types";

const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);
  // ✨ where are my props? Destructure them here
  const {
    onSubmit,
    articles,
    postArticle,
    updateArticle,
    setCurrentArticleId,
    currentArticle,
    currentArticleId
  } = props;

  useEffect(() => {
    // ✨ implement
    setValues(articles || initialFormValues);
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
  }, [articles]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const submit = (evt) => {
    evt.preventDefault();
    // ✨ implement
    onSubmit(values);
    setValues(initialFormValues);
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    currentArticle
      ? updateArticle( currentArticleId, {
          title: values.title,
          text: values.text,
          topic: values.topic,
        })
      : postArticle({
          title: values.title,
          text: values.text,
          topic: values.topic,
        });
  };

  const isDisabled = 
    // ✨ implement
    // Make sure the inputs have some values
    values.title.trim("").length >= 3 && 
    values.text.trim("").length >= 3 &&
    values.topic.trim("").length >= 1 

  // const isDisabled =
    // ✨ implement
    // values.username.trim("").length >= 3 &&
    // values.password.trim("").length >= 8;
  // Trimmed username must be >= 3, and
  // trimmed password must be >= 8 for
  // the button to become enabled

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={submit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={!isDisabled} id="submitArticle">
          Submit
        </button>
        <Link to={`/articles`}>
          <button onClick={Function.prototype}>Cancel edit</button>
        </Link>
      </div>
    </form>
  );
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
