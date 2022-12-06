#! /usr/bin/env node
import { fetch, $, question, fs, chalk } from "zx";

class Logger {
  info(text) {
    console.log(chalk.green(`INFO : ${text}`));
  }
  error(text) {
    console.log(chalk.red(`ERROR : ${text}`));
  }
}

const logger = new Logger();

const cookie = await question(chalk.green("please enter cookie> "));

const getNoteMap = async () => {
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
  return data.map((note) => ({ id: note.id, title: note.title }));
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
  if (response.ok) {
    const result = await response.json();
    return result.data.url;
  }
  return response.ok;
};

/**
 * 处理markdown中的图片格式
 * @param  string text
 */
const parseText = (text) => {
  const regp = /#clientId=[^)]*/g;
  return text.replaceAll(regp, "");
};

const writeFile = (fileName, content) => {
  logger.info(`writing ${fileName}...`);
  let directory = "./output";
  if (!fs.existsSync(directory)) {
    // 创建文件夹
    fs.mkdirSync(directory);
  }
  fs.writeFileSync(`${directory}/${fileName}`, content);
  logger.info(`writing ${fileName} done`);
};

const getExportedContent = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      cookie,
    },
  });
  if (response.ok) {
    const text = await response.text();
    return parseText(text);
  }
  return response.ok;
};

/*------ main ------*/
logger.info("script start");
const noteMap = await getNoteMap();
for (let { id, title } of noteMap) {
  logger.info(`noteId = ${id}`);
  const contentUrl = await getExportedContentUrl(id);
  if (!contentUrl) continue;
  const content = await getExportedContent(contentUrl);
  if (!content) continue;
  writeFile(`${title}.md`, content);
}
logger.info("script end");
