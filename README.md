To Run in a Codespace

1) Create new codespace on Main
2) Copy `.env.example` to `.env`
3) Update `FORCE_AUTH=true` in `.env`
4) Open 2 terminals
  1) In root directory, run `npm run dev` to start server
  2) In `vue` directory, run `npm run dev` to start client
5) Open client in web browser (port 3001)
6) Navigate to `/auth/login?eid=test-admin` to log in as test administrator
7) Can also use that path to log in as `test-student-1` through `test-student-4` with various roles

Contact me if this doesn't work :)