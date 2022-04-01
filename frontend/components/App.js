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

  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/");
    // setSpinnerOn(false);
  };

  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles");
    setSpinnerOn(false);
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setMessage("Goodby!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        const token = res.data.token;
        window.localStorage.setItem("token", token);
        setMessage(res.data.message);
        redirectToArticles();
      })
      .catch((err) => {
        err.response.status === 401
          ? redirectToLogin()
          : setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    setSpinnerOn(true);
    setMessage("");
    axiosWithAuth().get(articlesUrl)
      .then((res) => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch((err) => {
        // If something goes wrong, check the status of the response:
       err.response.status === 401 ? 
         redirectToLogin()
         :
         setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      // You'll know what to do! Use log statements or breakpoints
      // to inspect the response from the server.
      .then((res) => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
      })
      .catch((err) => {
        err.response.status === 401
          ? redirectToLogin()
          : setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // const { article_id, ...changes } = article;
    setCurrentArticleId(article_id);
    setSpinnerOn(true);
    setMessage("");
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
        err.response.status === 401
          ? redirectToLogin()
          : setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setSpinnerOn(true);
    setMessage("");
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
        err.response.status === 401
          ? redirectToLogin()
          : setMessage(err?.response?.data?.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const onSubmit = (articles) => {
    currentArticleId ? updateArticle(articles) : postArticle(articles);
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
                    (article) => article.id === currentArticleId
                  )}
                  setCurrentArticleId={setCurrentArticleId}
                  // articles={articles.find(
                    // (art) => art.article_id === currentArticleId
                  // )}
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  currentArticleId={currentArticleId}
                />
                <Articles
                  deleteArticle={deleteArticle}
                  getArticles={getArticles}
                  updateArticle={updateArticle}
                  articles={articles}
                  message={message}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
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
