#! /usr/bin/env node
import { fetch, $, question, fs, chalk } from "zx";
// const cookie = await question("please enter cookie> ");

const cookie =
  "lang=zh-cn; yuque_ctoken=fe7JCO4WPYr-fokO_2SwH0iX; _yuque_session=Yxvt7FKhpiAjwHBHiuoSDAnTd7db5PHZpOgska-y5iI_9w1LaxXkVJLS70u2kPIP-YoXyjboffYRne10BrJJig==; current_theme=default; acw_tc=0b68a81616702064709506907e7158eef12b76c54d44f2b09c8b7780115c3e; lang=zh-cn";

const getNoteList = async () => {
  const response = await fetch(
    "https://www.yuque.com/api/docs?book_id=10878407",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        cookie,
      },
    }
  );
  const { data } = await response.json();
  const noteList = data.map((note) => ({ id: note.id, title: note.title }));
  console.log(noteList);
};

const getExportedContentUrl = async (id) => {
  const response = await fetch(`https://www.yuque.com/api/docs/${id}/export`, {
    method: "POST",
    body: JSON.stringify({
      type: "markdown",
      force: 0,
      options: '{"latexType":1,"enableAnchor":1,"enableBreak":1}',
    }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      cookie,
      referer: "https://www.yuque.com/manmanmanman-jrzm5/wow1yv/di1oha",
    },
  });
  const result = await response.json();
  return result.data.url;
};

const getFileName = (str) => {
  return str.split("=")[1];
};

/**
 * 处理markdown中的图片格式
 * @param  string text
 */
const parseText = (text) => {};

const writeFile = (fileName, content) => {};

const getExportedContent = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      cookie:
        "lang=zh-cn; yuque_ctoken=fe7JCO4WPYr-fokO_2SwH0iX; _yuque_session=Yxvt7FKhpiAjwHBHiuoSDAnTd7db5PHZpOgska-y5iI_9w1LaxXkVJLS70u2kPIP-YoXyjboffYRne10BrJJig==; current_theme=default; acw_tc=0b68a81616702064709506907e7158eef12b76c54d44f2b09c8b7780115c3e; lang=zh-cn",
    },
  });
  const text = await response.text();
  const fileName = getFileName(response.headers.get("content-disposition"));
  const parsedText = par
  
};



/*------ main ------*/
const contentUrl = await getExportedContentUrl(72844784);
getExportedContent(contentUrl);
