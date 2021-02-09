const template = `
    <div>
        <ul>
            {%arr.forEach((item) => {%}
              <li>{{item}}</li>
            {%})%}
        </ul>
    </div>
`;
/**
 * 模板渲染原理
 * @param {String} template
 * @param {Object} data
 */
function render(template, data) {
  let head = "let str = '';with(obj){str+=`",
    tail = "`; return str;}";
  const variable = /\{\{([^}]+)\}\}/g;
  const expression = /\{\%([^%]+)\%\}/g;
  template = head + template;
  template = template.replace(variable, (_, r) => "${" + r + "}");
  template = template.replace(expression, (_, r) => {
    return "`;" + r + ";str+=`";
  });
  template += tail;
  const fn = new Function("obj", template);
  return fn(data);
}

console.log(render(template, { arr: [1, 2, 3, 4] }));
