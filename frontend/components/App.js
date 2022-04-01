import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosWithAuth from "../axios/index";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = ({ username, password }) => {
    /* ✨ implement */
    console.log({username, password})
    navigate("/login");
  };

  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    window.localStorage.removeItem("token");
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage("Goodby!");
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage("");
    setSpinnerOn(true);
    axios
      // and launch a request to the proper endpoint.
      .post(loginUrl, { username, password })
      .then((res) => {
        // On success, we should set the token to local storage in a 'token' key,
        const token = res.data.token;
        window.localStorage.setItem("token", token);
        setMessage(res.data.message);
        // put the server success message in its proper state, and redirect
        redirectToArticles();
        // to the Articles screen. Don't forget to turn off the spinner!
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    // ✨ implement
    setSpinnerOn(true);
    setMessage("")
    // We should flush the message state, turn on the spinner
    axiosWithAuth()
      // and launch an authenticated request to the proper endpoint.
      .get(articlesUrl)
      .then((res) => {
        // On success, we should set the articles in their proper state and
        setArticles(res.data.articles);
        // put the server success message in its proper state.
        setMessage(res.data.message)
      })
      .catch((err) => {
        // If something goes wrong, check the status of the response:
        setMessage(err?.response?.data?.message);
        // if it's a 401 the token might have gone bad, and we should redirect to login.
        // Don't forget to turn off the spinner!
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    setMessage("")
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      // You'll know what to do! Use log statements or breakpoints
      // to inspect the response from the server.
      .then((res) => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message)
      })
      .catch((err) => {
        setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setSpinnerOn(true);
    setMessage("")
    const { ...changes } = article;
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, changes)
      .then((res) => {
        setArticles(
          articles.map((art) => {
            return art.article_id === article_id ? res.data.article : art;
          })
        );
        setMessage(res.data.message);
        setCurrentArticleId(null);
      })
      .catch((err) => {
        setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setSpinnerOn(true);
    setMessage("")
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        setMessage(res.data.message);
        setArticles(
          articles.filter((art) => {
            return art.article_id !== article_id;
          })
        );
      })
      .catch((err) => {
        setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const onSubmit = (article) => {
    if (currentArticleId) {
      updateArticle(article);
    } else {
      postArticle(article);
    }
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  onSubmit={onSubmit}
                  articles={articles.find(
                    (art) => art.article_id === currentArticleId
                  )}
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                />
                <Articles
                  deleteArticle={deleteArticle}
                  getArticles={getArticles}
                  updateArticle={updateArticle}
                  articles={articles}
                  spinnerOn={spinnerOn}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  );
}
