const template = `
    <div>
        <ul>
            <li>{{name}}</li>
            <li>{{age}}</li>
        </ul>
    </div>
`;

/**
 * 模板渲染原理
 * @param {String} template
 * @param {Object} data
 */
function render(template, data) {
  const reg = /\{\{(\w+)\}\}/;

  while (reg.test(template)) {
    const key = reg.exec(template)[1];
    template = template.replace(reg, data[key]);
  }

  return template;
}

console.log(render(template, { name: "kilic", age: 22 }));
