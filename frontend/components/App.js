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
    navigate("/");
  };

  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
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
        setMessage(err.response.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    setSpinnerOn(true);
    setMessage("");
    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch((err) => {
        err.response.status === 401
          ? redirectToLogin()
          : setMessage(err.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = (article) => {
    // setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
      })
      .catch((err) => {
        err.response.status === 401
          ? redirectToLogin()
          : setMessage(err.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const updateArticle = (article_id, article) => {
    setSpinnerOn(true);
    setMessage("");
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        setMessage(res.data.message);
        setArticles(
          articles.map((art) => {
            return art.article_id === article_id ? res.data.article : art;
          })
        );
        setCurrentArticleId(null);
      })
      .catch((err) => {
        err.response.status === 401
          ? redirectToLogin()
          : setMessage(err.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    setMessage("");
    setSpinnerOn(true);
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
          : setMessage(err.response.data.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  return (
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
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  articles={articles.find(
                    (article) => article.article_id === currentArticleId
                  )}
                  redirectToArticles={redirectToArticles}
                />
                <Articles
                  deleteArticle={deleteArticle}
                  getArticles={getArticles}
                  articles={articles}
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
