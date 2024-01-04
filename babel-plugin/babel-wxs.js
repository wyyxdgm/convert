function extractAssignments(node) {
  const assignments = [];
  let currentNode = node;

  while (currentNode.type === "AssignmentExpression") {
    assignments.push(currentNode);
    currentNode = currentNode.left;
  }

  return assignments.reverse();
}

module.exports = function ({ types }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        let { node } = path;
        const declarations = node.declarations;
        for (const declaration of declarations) {
          const init = declaration.init;
          if (init && init.type === "AssignmentExpression") {
            const assignments = extractAssignments(init);

            let currentDeclaration = declaration;
            for (let i = assignments.length - 1; i >= 0; i--) {
              const assignment = assignments[i];
              const newDeclaration = {
                type: "VariableDeclaration",
                kind: node.kind,
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: assignment.left,
                    init: assignment.right,
                  },
                ],
              };

              path.container.unshift(newDeclaration);
              currentDeclaration.init = assignment.left;
              currentDeclaration = newDeclaration;
            }
          }
        }
      },
    },
  };
};
