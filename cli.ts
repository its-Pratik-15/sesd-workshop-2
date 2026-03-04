#!/usr/bin/env node
const {Command} = require('commander');
const axios = require('axios');
const nodeCrypto = require('crypto');

const program = new Command();
program.name('mycli').description('A multi-purpose CLI tool').version('1.0.0');

program
  .command('greet <name>')
  .description('Greet someone by name')
  .action((name: string) => console.log(`Hello ${name}`));

program
  .command('add <a> <b>')
  .description('Add two numbers')
  .action((a: string, b: string) => console.log(Number(a) + Number(b)));

program
  .command('subtract <a> <b>')
  .description('Subtract two numbers')
  .action((a: string, b: string) => console.log(Number(a) - Number(b)));

program
  .command('quote')
  .description('Fetch Pikachu data from PokeAPI')
  .action(async () => {
    try {
      const res = await axios.get('https://pokeapi.co/api/v2/pokemon/pikachu');
      console.log(res.data);
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  });

// ============ GITHUB COMMANDS ============

const github = program.command('gh').description('GitHub utility commands');

github
  .command('user <username>')
  .description('Fetch a GitHub user profile')
  .action(async (username: string) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${username}`);
      const u = res.data;
      console.log(`
  Name:       ${u.name || 'N/A'}
  Login:      ${u.login}
  Bio:        ${u.bio || 'N/A'}
  Public Repos: ${u.public_repos}
  Followers:  ${u.followers}
  Following:  ${u.following}
  Location:   ${u.location || 'N/A'}
  URL:        ${u.html_url}
      `);
    } catch (err: any) {
      console.error('Error:', err.response?.status === 404 ? 'User not found' : err.message);
    }
  });

github
  .command('repos <username>')
  .description('List public repos of a GitHub user')
  .option('-s, --sort <sort>', 'Sort by: stars, updated, name', 'stars')
  .option('-l, --limit <n>', 'Max repos to show', '10')
  .action(async (username: string, opts: any) => {
    try {
      const res = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: { per_page: 100, sort: 'updated' }
      });
      let repos = res.data;
      if (opts.sort === 'stars') {
        repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
      } else if (opts.sort === 'name') {
        repos.sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
      repos = repos.slice(0, Number(opts.limit));
      console.log(`\n  Repos for ${username} (sorted by ${opts.sort}):\n`);
      repos.forEach((r: any, i: number) => {
        console.log(`  ${i + 1}. ${r.name} ★ ${r.stargazers_count} | ${r.language || 'N/A'} | ${r.description || ''}`);
      });
      console.log();
    } catch (err: any) {
      console.error('Error:', err.response?.status === 404 ? 'User not found' : err.message);
    }
  });

github
  .command('repo <owner> <repo>')
  .description('Get details of a specific GitHub repo')
  .action(async (owner: string, repo: string) => {
    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
      const r = res.data;
      console.log(`
  Repo:        ${r.full_name}
  Description: ${r.description || 'N/A'}
  Stars:       ${r.stargazers_count}
  Forks:       ${r.forks_count}
  Open Issues: ${r.open_issues_count}
  Language:    ${r.language || 'N/A'}
  Created:     ${new Date(r.created_at).toLocaleDateString()}
  URL:         ${r.html_url}
      `);
    } catch (err: any) {
      console.error('Error:', err.response?.status === 404 ? 'Repo not found' : err.message);
    }
  });

github
  .command('trending')
  .description('Show trending repos on GitHub (most starred recently)')
  .option('-l, --lang <language>', 'Filter by language', '')
  .option('-n, --count <n>', 'Number of results', '10')
  .action(async (opts: any) => {
    try {
      const since = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      let q = `created:>${since}`;
      if (opts.lang) q += `+language:${opts.lang}`;
      const res = await axios.get('https://api.github.com/search/repositories', {
        params: { q, sort: 'stars', order: 'desc', per_page: Number(opts.count) }
      });
      console.log(`\n  Trending repos (past week)${opts.lang ? ` — ${opts.lang}` : ''}:\n`);
      res.data.items.forEach((r: any, i: number) => {
        console.log(`  ${i + 1}. ${r.full_name} ★ ${r.stargazers_count} | ${r.language || 'N/A'}`);
        console.log(`     ${r.description || ''}`);
      });
      console.log();
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  });

// ============ UNIQUE UTILITY COMMANDS ============

program
  .command('weather <city>')
  .description('Get current weather for a city (wttr.in)')
  .action(async (city: string) => {
    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const c = res.data.current_condition[0];
      const loc = res.data.nearest_area[0];
      console.log(`
  Weather for ${loc.areaName[0].value}, ${loc.country[0].value}:
  Condition:   ${c.weatherDesc[0].value}
  Temperature: ${c.temp_C}°C / ${c.temp_F}°F
  Feels Like:  ${c.FeelsLikeC}°C
  Humidity:    ${c.humidity}%
  Wind:        ${c.windspeedKmph} km/h ${c.winddir16Point}
      `);
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  });

program
  .command('joke')
  .description('Get a random programming joke')
  .action(async () => {
    try {
      const res = await axios.get('https://official-joke-api.appspot.com/jokes/programming/random');
      const joke = res.data[0];
      console.log(`\n  ${joke.setup}\n  → ${joke.punchline}\n`);
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  });

program
  .command('ip')
  .description('Show your public IP address and location')
  .action(async () => {
    try {
      const res = await axios.get('https://ipapi.co/json/');
      const d = res.data;
      console.log(`
  IP:       ${d.ip}
  City:     ${d.city}
  Region:   ${d.region}
  Country:  ${d.country_name}
  Org:      ${d.org}
  Timezone: ${d.timezone}
      `);
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  });

program
  .command('uuid')
  .description('Generate a random UUID')
  .option('-n, --count <n>', 'Number of UUIDs', '1')
  .action((opts: any) => {
    for (let i = 0; i < Number(opts.count); i++) {
      console.log(nodeCrypto.randomUUID());
    }
  });

program
  .command('password')
  .description('Generate a random password')
  .option('-l, --length <n>', 'Password length', '16')
  .action((opts: any) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    const bytes = nodeCrypto.randomBytes(Number(opts.length));
    let pw = '';
    for (let i = 0; i < Number(opts.length); i++) {
      pw += chars[bytes[i] % chars.length];
    }
    console.log(pw);
  });

program
  .command('hash <text>')
  .description('Hash text with md5, sha1, or sha256')
  .option('-a, --algo <algorithm>', 'Hash algorithm', 'sha256')
  .action((text: string, opts: any) => {
    const hash = nodeCrypto.createHash(opts.algo).update(text).digest('hex');
    console.log(`${opts.algo}: ${hash}`);
  });

program.parse();


