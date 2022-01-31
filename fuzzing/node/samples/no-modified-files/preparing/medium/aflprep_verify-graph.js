'use strict';
const assert = require('assert');
const util = require('util');
function findInGraph(graph, type, n) {
  let found = 0;
  for (let i = 0; i < graph.length; i++) {
    const node = graph[i];
    if (node.type === type) found++;
    if (found === n) return node;
  }
}
function pruneTickObjects(activities) {
  const tickObject = {
    found: true,
    index: null,
    data: null
  };
  if (!Array.isArray(activities))
    return activities;
  while (tickObject.found) {
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].type === 'TickObject') {
        tickObject.index = i;
        break;
      } else if (i + 1 >= activities.length) {
        tickObject.found = false;
      }
    }
    if (tickObject.found) {
      tickObject.data = activities[tickObject.index];
      const triggerId = {
        new: tickObject.data.triggerAsyncId,
        old: tickObject.data.uid
      };
      activities.forEach(function repointTriggerId(x) {
        if (x.triggerAsyncId === triggerId.old)
          x.triggerAsyncId = triggerId.new;
      });
      activities.splice(tickObject.index, 1);
    }
  }
  return activities;
}
module.exports = function verifyGraph(hooks, graph) {
  pruneTickObjects(hooks);
  const idtouid = {};
  const uidtoid = {};
  const typeSeen = {};
  const errors = [];
  const activities = pruneTickObjects(hooks.activities);
  activities.forEach(processActivity);
  function processActivity(x) {
    if (!typeSeen[x.type]) typeSeen[x.type] = 0;
    typeSeen[x.type]++;
    const node = findInGraph(graph, x.type, typeSeen[x.type]);
    if (node == null) return;
    idtouid[node.id] = x.uid;
    uidtoid[x.uid] = node.id;
    if (node.triggerAsyncId == null) return;
    const tid = idtouid[node.triggerAsyncId];
    if (x.triggerAsyncId === tid) return;
    errors.push({
      id: node.id,
      expectedTid: node.triggerAsyncId,
      actualTid: uidtoid[x.triggerAsyncId]
    });
  }
  if (errors.length) {
    errors.forEach((x) =>
      console.error(
        `'${x.id}' expected to be triggered by '${x.expectedTid}', ` +
        `but was triggered by '${x.actualTid}' instead.`
      )
    );
  }
  assert.strictEqual(errors.length, 0);
  const expTypes = Object.create(null);
  for (let i = 0; i < graph.length; i++) {
    if (expTypes[graph[i].type] == null) expTypes[graph[i].type] = 0;
    expTypes[graph[i].type]++;
  }
  for (const type in expTypes) {
    assert.ok(typeSeen[type] >= expTypes[type],
              `Type '${type}': expecting: ${expTypes[type]} ` +
              `found: ${typeSeen[type]}`);
  }
};
function inspect(obj, depth) {
  console.error(util.inspect(obj, false, depth || 5, true));
}
module.exports.printGraph = function printGraph(hooks) {
  const ids = {};
  const uidtoid = {};
  const activities = pruneTickObjects(hooks.activities);
  const graph = [];
  activities.forEach(procesNode);
  function procesNode(x) {
    if (!ids[key]) ids[key] = 1;
    const id = `${key}:${ids[key]++}`;
    uidtoid[x.uid] = id;
    const triggerAsyncId = uidtoid[x.triggerAsyncId] || null;
    graph.push({ type: x.type, id, triggerAsyncId });
  }
  inspect(graph);
};