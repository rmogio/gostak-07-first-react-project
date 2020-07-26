/* eslint-disable camelcase */
import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [inputRepo, setInputRepo] = useState('');
  const [inputError, setInputError] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storage = localStorage.getItem('@GithubExplorer:repositories');

    if (storage) {
      return JSON.parse(storage);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepo(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!inputRepo) {
      setInputError('Digite um autor/repositorio valido');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${inputRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setInputRepo('');
      setInputError('');
    } catch (err) {
      setInputError('O autor/repositorio nao existe');
    }
  }

  return (
    <>
      <img src={logoImg} alt="imagem de logo" />
      <Title>Explore Repositórios do GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepo}>
        <input
          onChange={e => setInputRepo(e.target.value)}
          value={inputRepo}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
