import React, { useState, useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import logo from '../../assets/logo.svg'

import { Header, RepositoryInfo, Issues } from './styles'
import api from '../../services/api'

interface RepositoryParams {
  repositoryName: string
}

interface Repository {
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  open_issues: number
  owner: {
    login: string
    avatar_url: string
  }
}

interface Issue {
  id: number
  title: string
  html_url: string
  user: {
    login: string
  }
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository>()
  const [issues, setIssues] = useState<Issue[]>([])

  const {
    params: { repositoryName },
  } = useRouteMatch<RepositoryParams>()

  useEffect(() => {
    async function fetchRepositoryData(): Promise<void> {
      const promiseRepositoryInfo = api.get<Repository>(
        `repos/${repositoryName}`
      )
      const promiseReposityIssues = api.get<Issue[]>(
        `repos/${repositoryName}/issues`
      )

      const [
        repositoryInfoResponse,
        repositoryIssuesResponse,
      ] = await Promise.all([promiseRepositoryInfo, promiseReposityIssues])

      setRepository(repositoryInfoResponse.data)
      setIssues(repositoryIssuesResponse.data)
    }

    fetchRepositoryData()
  }, [])

  return (
    <>
      <Header>
        <img src={logo} alt="Github Explorer" />

        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>

          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(i => (
          <a key={i.id} href={i.html_url}>
            <div>
              <strong>{i.title}</strong>
              <p>{i.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  )
}

export default Repository
