const fs = require("fs");

const filePath = "./target2.js";
// const oldString = `process.env["APPLICATIONINSIGHTS_CONFIGURATION_CONTENT"]`;
// const newString = `process.env["APPLICATIONINSIGHTS_CONFIGURATION_CONTENT"] || "{}"`;
const oldString = `console.log("hello");`;
const newString = `console.log("he3llo2");`;
try {
    const data = fs.readFileSync(filePath, "utf8");
    console.log(data);
    const updatedData = data.replaceAll(oldString, newString);


    fs.writeFileSync(filePath, updatedData, "utf8");

    console.log(
        "after build success - APPLICATIONINSIGHTS_CONFIGURATION_CONTENT의 기본값 처리가 완료 되었습니다."
    );
} catch (err) {
    console.error(
        "after build error - APPLICATIONINSIGHTS_CONFIGURATION_CONTENT의 기본값 처리중 오류가 발생했습니다.",
        err
    );
}