import { useParams } from 'react-router-dom';
import Logo from '../images/logo.png'
import { useNavigate } from "react-router-dom";
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';
import Loading from '../images/loading.svg';

const tranformData = (initialData) => {
  if (initialData) {
    const {
      node_type, das_network_head, das_sampled_chain_head,
      last_accumulative_node_runtime_counter_in_seconds, ...other
    } = initialData;

    for (let key in other) {
      const value = other[key];
      if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date)) other[key] = date.toLocaleString();
      }
    }

    return {...other};
  }
}

const substituteName = (start) => {
  const dataKeys = [
    'Light node ID 🆔', 'Latest metric time ⌚', 'Node Uptime in % ⬆️', 'Last PFB TX Time ⌚',
    'Total number of pfb transactions 💰', 'Head 🗿', 'Block height 📏', 'Last sampled header time ⌚',
    'Sampled headers counter 🗿', 'Total headers sampled 🗿', 'Total headers synced 🗿',
    'Node start time ⌚', 'Last node restart time ⌚', 'Total node runtime in days 📆',
    'Your node type 🟣'
  ];
  
  switch(start) {
    case 'node_id':
      return dataKeys[0];
    case 'latest_metrics_time':
      return dataKeys[1];
    case 'uptime':
      return dataKeys[2];
    case 'last_pfb_timestamp':
      return dataKeys[3];
    case 'pfb_count':
      return dataKeys[4];
    case 'head':
      return dataKeys[5];
    case 'network_height':
      return dataKeys[6];
    case 'das_latest_sampled_timestamp':
      return dataKeys[7];
    case 'das_sampled_headers_counter':
      return dataKeys[8];
    case 'das_total_sampled_headers':
      return dataKeys[9];
    case 'total_synced_headers':
      return dataKeys[10];
    case 'start_time':
      return dataKeys[11];
    case 'last_restart_time':
      return dataKeys[12];
    case 'node_runtime_counter_in_seconds':
      return dataKeys[13];
    case 'node_type_str':
      return dataKeys[14];
  }
}

const tranformKey = (key) => {
  const arr = key.split('_');
  const firstWord = arr[0][0].toUpperCase() + arr[0].slice(1, arr[0].length);
  return firstWord + ' ' + arr.slice(1, arr.length).join(' ');
}

export const HomePage = () => {
  const params = useParams();
  const {mutate, data, isError, isLoading} = useMutation('data', (id) => {
    return fetch(`https://leaderboard.celestia.tools/api/v1/nodes/${id}`)
      .then(res => res.json());
  });

  const [nodeId, setNodeId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (params && params.id) mutate(params.id);
  }, [params.id]);  

  useEffect(() => {
    console.log('ini', data);
  }, [data, isError, isLoading]);

  const handleSearch = () => {
    if (nodeId.length !== 0) navigate(`/${nodeId}`);
  }

  return (
    <div className="container">
      <nav className="nav">
        <img src={Logo} alt="logo" />
        <ul>
          <li><a href='https://twitter.com/CelestiaOrg' target='_blank'>Twitter</a></li>
          <li><a href="https://docs.celestia.org" target='_blank'>Docs</a></li>
          <li><a href="https://discord.com/invite/YsnTPcSfWQ" target='_blank'>Discord</a></li>
        </ul>
      </nav>
      <div className="search">
        <div className="search__input">
          <div>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.23336 1.8999C4.74306 1.8999 1.90002 4.74293 1.90002 8.23324C1.90002 11.7235 4.74306 14.5666 8.23336 14.5666C9.75115 14.5666 11.145 14.0276 12.2375 13.1329L16.0189 16.9144C16.0773 16.9751 16.1472 17.0237 16.2245 17.0571C16.3019 17.0905 16.3851 17.1082 16.4694 17.109C16.5536 17.1099 16.6372 17.0939 16.7152 17.0621C16.7932 17.0302 16.8641 16.9831 16.9237 16.9236C16.9833 16.864 17.0304 16.7931 17.0622 16.7151C17.0941 16.6371 17.11 16.5535 17.1092 16.4692C17.1083 16.385 17.0907 16.3017 17.0572 16.2244C17.0238 16.147 16.9753 16.0771 16.9145 16.0188L13.133 12.2373C14.0277 11.1449 14.5667 9.75102 14.5667 8.23324C14.5667 4.74293 11.7237 1.8999 8.23336 1.8999ZM8.23336 3.16657C11.0391 3.16657 13.3 5.42749 13.3 8.23324C13.3 11.039 11.0391 13.2999 8.23336 13.2999C5.42761 13.2999 3.16669 11.039 3.16669 8.23324C3.16669 5.42749 5.42761 3.16657 8.23336 3.16657Z" fill="black"/>
            </svg>
          </div>
          <input
            defaultValue={params.id} 
            onChange={e => {setNodeId(e.target.value)}}
            type="text" name="search" placeholder='Enter your light node id'
          />
        </div>
        <button onClick={handleSearch}>Search</button>
      </div>
      {
        isLoading ? (
          <div className='loading'>
            <img src={Loading} alt="loading" />
          </div>
        ) : isError ? (
          <h3 className='error'>Error, try enter the node id again</h3>
        ) : data ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.entries(tranformData(data)).map(([key, value]) => {
                    return (
                      <tr key={key}>
                        <td>{substituteName(key) || tranformKey(key)}</td>
                        <td>
                          {key === 'node_runtime_counter_in_seconds' ? Math.round(+value / 86400) : value}
                        </td>
                      </tr>
                    )
                  })
                }
                <tr>
                  <td>Your node is synced for % ⛓️</td>
                  <td>
                    {(+data.total_synced_headers / +data.network_height * 100).toFixed(3)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null
      }
    </div>
  )
}