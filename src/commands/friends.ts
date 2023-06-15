import { ServerData, friends, registerCommand } from "..";
import { writeFriends } from "../utils";

registerCommand("friends", friendsFn);

export function friendsFn(data: ServerData, args: string[], repl?: boolean) {
  if (!args[0]) {
    if (repl) {
      return {
        success: false,
        message: "Expected Usage: friends <add|remove|list> [name?]",
      };
    }
    console.log(`expected usage: friends <add|remove|list> [name?]`);
    return;
  }

  if (args[0] == "add") {
    if (!args[1]) {
      if (repl) {
        return {
          success: false,
          message: "Expected Usage: friends <add|remove|list> [name?]",
        };
      }
      console.log(`expected usage: friends <add|remove|list> [name?]`);
      return;
    }

    if (friends.friends.includes(args[1])) {
      if (repl) {
        return {
          success: false,
          message: `Already have ${args[1]} added as a friend.`,
        };
      }
      console.log(`Already having ${args[1]} added as a friend.`);
      return;
    }

    friends.friends.push(args[1]);
    writeFriends(friends);
    if (repl) {
      return { success: true, message: `Added ${args[1]} as a friend.` };
    }
    console.log(`Added ${args[1]} as a friend.`);
    return;
  } else if (args[0] == "remove") {
    if (!args[1]) {
      if (repl) {
        return {
          success: false,
          message: "Expected Usage: friends <add|remove|list> [name?]",
        };
      }
      console.log(`expected usage: friends <add|remove|list> [name?]`);
      return;
    }

    if (!friends.friends.includes(args[1])) {
      if (repl) {
        return {
          success: false,
          message: "Expected Usage: friends <add|remove|list> [name?]",
        };
      }
      console.log(`${args[1]} is not added as a friend.`);
      return;
    }

    friends.friends = friends.friends.filter((x) => x != args[1]);
    writeFriends(friends);

    if (repl) {
      return {
        success: true,
        message: `${args[1]} was removed as a friend.`,
      };
    }

    console.log(`${args[1]} was removed as a friend.`);
    return;
  } else if (args[0] == "list") {
    if (repl) {
      return {
        success: true,
        message: friendsString(data),
      };
    }
    console.log(friendsString(data));
  }
}

function friendsString(data: ServerData) {
  let string = "";

  let fClone = [...friends.friends];

  for (let i = 0; i < data.servers.length; i++) {
    let s = data.servers[i];

    if (!s.info.clients) continue;

    for (let c = 0; c < s.info.clients.length; c++) {
      let client = s.info.clients[c];

      if (friends.friends.includes(client.name)) {
        string += `${client.name} - ${s.info.map.name} (${s.info.game_type})\n`;
        fClone.splice(
          fClone.indexOf(client.name),
          fClone.indexOf(client.name) + 1
        );
      }
    }
  }

  for (let i = 0; i < fClone.length; i++) {
    string += `${fClone[i]} - Offline\n`;
  }

  return string;
}