This is the repository for the backend code.

Setting up the project
- Make a copy of .env.example named .env and then copy your API key into it. To obtain the API key containing our data, ask Raymond. It should have the following format:
```
SUPABASE_URL=
SUPABASE_KEY=
RESEND_API_KEY=
SENDER_EMAIL=
```
- Run the command `npm install` in the project directory.

Running the project locally
- run the command `node index.js` in the project directory.

# UML Diagrams

Sequence diagram: Account Registration / Email Validation
<img width="771" height="823" alt="sequencefinal drawio" src="https://github.com/user-attachments/assets/97e20f1a-741d-4801-a70b-1e38171fb36b" />

State diagram: Login
<img width="1141" height="390" alt="finalstate drawio" src="https://github.com/user-attachments/assets/883b7c78-5ef3-4777-84de-51380751c7fb" />
