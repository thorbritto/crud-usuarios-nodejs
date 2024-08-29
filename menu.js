// modulos e bibliotecas que precisaremos para executar o código
const readline = require('readline');
const fs = require('fs');
const path = './usuarios.json';

// function to read users on JSON's file
function lerUsuarios(){ 
  try{
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch(err) {
    return[];
  }
}

// function to save users on JSON's file
function salvarUsuarios(){
  fs.writeFileSync(path, JSON.stringify(usuarios, null, 2));
}

// function to create new ID's
function gerarID(){
  const idRepetido = new Set(usuarios.map(usuario => usuario.id));
  let id;
  do{
    id = Math.floor(Math.random() *1000) + 1;
  } while(idRepetido.has(id));
  return id;
}
// setting readline for input/output in terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// list for storing users
let usuarios = [];

// creating function to show menu
function exibirMenu() {
  console.log(`
   Menu de Cadastro:
  1 - Adicionar usuário
  2 - Ver usuários
  3 - Atualizar usuário
  4 - Remover usuário
  5 - Sair
  `);

  // turning the menu interactive and redirecting each number to its function
  rl.question('Escolha uma opção: ', (opcao) => {
    switch(opcao) {
      case '1':
        cadastrarUsuario();
        break;
      case '2':
        verUsuarios();
        break;
      case '3':
        atualizarUsuario();
        break;
      case '4':
        removerUsuario();
        break;
      case '5':
        rl.close();
        break;
      default:
        console.log('Só são números de 1 a 5, cara!\n Tente novamente.');
        exibirMenu();
        break;
    }
  });
}

// creating function to add user (C)
function cadastrarUsuario() {
  rl.question('Nome: ', (nome) => {
    rl.question('Email: ', (email) => {
      if (!email.match(/^\S+@\S+\.\S+$/)) {
        console.log('Email inválido, faça novamente.');
        return exibirMenu();
      }
      rl.question('CPF (11 dígitos): ', (cpf) => {
        if (!cpf.match(/^\d{11}$/)) {
          console.log('CPF inválido, pois deve conter exatamente 11 dígitos.');
          return exibirMenu();
        }
        const usuario = {
          id: gerarID(),
          nome,
          email,
          cpf
        };
        //add users => array 'usuarios'        
        usuarios.push(usuario);
        salvarUsuarios();
        console.log('Usuário cadastrado com sucesso!');
        exibirMenu();
      });
    });
  });
}

// function to see already registered users (R)
function verUsuarios() {
  if (usuarios.length === 0) {
    console.log('Não há usuário(s) cadastrado(s).');
  } else {
    console.log('Lista de usuários cadastrados:');
    usuarios.forEach((usuario, index) => {
      console.log(`${index + 1}. ID: ${usuario.id}, Nome: ${usuario.nome}, Email: ${usuario.email}, CPF: ${usuario.cpf}`);
    });
  }
  exibirMenu();
}

//function to update users information (U)
function atualizarUsuario() {
  if (usuarios.length === 0) {
    console.log('Não há usuário(s) cadastrado(s).');
    exibirMenu();
  } else {
    rl.question('Digite o ID do usuário que deseja atualizar: ', (id) => {
      const usuario = usuarios.find(user => user.id === parseInt(id));
      if (usuario) {
        rl.question('Novo Nome: ', (nome) => {
          rl.question('Novo Email: ', (email) => {
            if (!email.match(/^\S+@\S+\.\S+$/)) {
              console.log('Email inválido. Tente novamente.');
              return exibirMenu();
            }
            rl.question('Novo CPF (11 dígitos): ', (cpf) => {
              if (!cpf.match(/^\d{11}$/)) {
                console.log('CPF inválido. Deve conter exatamente 11 dígitos.');
                return exibirMenu();
              }
              usuario.nome = nome;
              usuario.email = email;
              usuario.cpf = cpf;
              salvarUsuarios();
              console.log('Usuário atualizado com sucesso!');
              exibirMenu();
            });
          });
        });
      } else {
        console.log('Usuário não encontrado.');
        exibirMenu();
      }
    });
  }
}

// function to delete users (D)
function removerUsuario() {
  if (usuarios.length === 0) {
    console.log('Não há usuário(s) cadastrado(s).');
    exibirMenu();
  } else {
    rl.question('Digite o ID do usuário que deseja remover: ', (id) => {
      const index = usuarios.findIndex(user => user.id === parseInt(id));
      if (index !== -1) {
        usuarios.splice(index, 1);
        salvarUsuarios();
        console.log('Usuário removido com sucesso!');
      } else {
        console.log('Usuário não encontrado.');
      }
      exibirMenu();
    });
  }
}

exibirMenu();

