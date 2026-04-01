export function downloadJsonFile(data: any, filename: string) {
  // 将数据转换为 JSON 字符串
  const jsonString = JSON.stringify(data, null, 2); // 格式化的 JSON 字符串

  // 创建一个 Blob 对象
  const blob = new Blob([jsonString], { type: "application/json" });

  // 创建一个下载链接
  const url = URL.createObjectURL(blob);

  // 创建一个临时的 <a> 标签用于下载
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // 设置下载文件名

  // 将 <a> 标签添加到文档中并 trigger click
  document.body.appendChild(a);
  a.click();

  // 清理操作
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // 释放 URL 对象
}
export function downloadFile(data: Blob, filename: string) {
  let blob = data; // 直接使用传入的 Blob
  let mimeType = blob.type; // 获取实际的 MIME 类型

  // 根据 MIME 类型设置文件后缀
  if (mimeType === "image/jpeg") {
    filename += ".jpg";
  } else if (mimeType === "image/png") {
    filename += ".png";
  } else if (mimeType === "application/json") {
    filename += ".json";
  } else if (mimeType === "text/plain") {
    filename += ".txt"; // 假设为文本文件
  } else if (mimeType === "video/mp4") {
    // 添加对 MP4 文件的支持
    filename += ".mp4";
  } else if (mimeType === "audio/mpeg") {
    // 添加对 MP3 文件的支持
    filename += ".mp3";
  } else if (mimeType === "image/webp") {
    // 添加对 WebP 文件的支持
    filename += ".webp";
  } else {
    filename += ".file"; // 默认后缀
  }

  // 创建一个下载链接
  const url = URL.createObjectURL(blob);

  // 创建一个临时的 <a> 标签用于下载
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // 设置下载文件名

  // 将 <a> 标签添加到文档中并触发点击事件
  document.body.appendChild(a);
  a.click();

  // 清理操作
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // 释放 URL 对象
}
