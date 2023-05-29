import React, { Fragment, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAccount } from '@plebbit/plebbit-react-hooks';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Header, Logo, Page, Search, About, AboutTitle, AboutContent, Boards, BoardsTitle, BoardsContent, Footer } from '../styled/views/Home.styled';
import BoardAvatar from '../BoardAvatar';
import OfflineIndicator from '../OfflineIndicator';
import packageJson from '../../../package.json'
import { Tooltip } from 'react-tooltip';
const {version} = packageJson
// show commit ref on netlify to know which commit is being served for debugging
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : ''


const Home = () => {
  const { 
    bodyStyle, setBodyStyle,
    defaultSubplebbits,
    setSelectedAddress, 
    selectedStyle, setSelectedStyle,
    setSelectedTitle
  } = useGeneralStore(state => state);

  const account = useAccount();
  const navigate = useNavigate();
  
  const inputRef = useRef(null);
  const prevStyle = useRef(selectedStyle);
  const prevBodyStyle = useRef(bodyStyle);

  // prevent dark mode
  useEffect(() => {
    const currentPrevStyle = prevStyle.current;
    const currentPrevBodyStyle = prevBodyStyle.current;

    setBodyStyle({
      background: "#ffe url(assets/fade.png) top repeat-x",
      color: "maroon",
      fontFamily: "Helvetica, Arial, sans-serif"
    });
    setSelectedStyle("Yotsuba");

    return () => {
      setSelectedStyle(currentPrevStyle);
      setBodyStyle(currentPrevBodyStyle);
    };
  }, [setBodyStyle, setSelectedStyle]);


  return (
    <>
      <Helmet>
        <title>plebchan</title>
      </Helmet>
      <Container>
        <Tooltip id="tooltip" className="tooltip" />
        <Header>
          <Logo>
            <Link to="/">
              <img alt="plebchan" src="assets/logo/logo-transparent.png" />
            </Link>
          </Logo>
        </Header>
        <Page>
          <Search>
            <input type="text" placeholder='"board.eth" or "12D3KooW..."' ref={inputRef} onKeyDown={
              (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const address = inputRef.current.value;
                  if (address) {
                    setSelectedAddress(address);
                    navigate(`/p/${address}`)
                  }
                }
            }} />
            <input type="submit" value="Search" onClick={
              () => {
                const address = inputRef.current.value;
                if (address) {
                  setSelectedAddress(address);
                  navigate(`/p/${address}`)
                }
              }
            } />
          </Search>
          <About>
            <AboutTitle>
              <h2>What is plebchan?</h2>
            </AboutTitle>
            <AboutContent>
              <div id="content">
                <p>Plebchan is a serverless, adminless, decentralized 4chan alternative that uses the <a href="https://plebbit.com" target="_blank" rel="noreferrer">plebbit protocol</a>. Users do not need to register an account before participating in the community; anyone can post comments, share media links, and <button 
                style={{all: 'unset', cursor: 'pointer'}}
                onClick={() => alert(
                  'To create a board, first you have to run a full node.\nYou can run a full node by simply browsing with the plebbit desktop app. After you download it, open it, wait for it loading, then click on "Home" in the top left, then "Create Community".\n\nAfter you create the community, you can go back to plebchan at any time to see it as a board by pasting its address (begins with p/12D3KooW...) in the search bar, which is in the Home.\n\nNote:\n\n- Your community will be online for as long as you leave the app open, because it functions like a server for the community.\n- The longer you leave the app open, the more data you are seeding to the protocol, which helps performance for everybody.\n - All the data in the plebbit protocol is just text, which is extremely lightweight. All media is generated by links, which is text, embedded by the clients.\n\nDownload the plebbit app here: https://github.com/plebbit/plebbit-react/releases\n\nYou can also use a CLI: https://github.com/plebbit/plebbit-cli\n\nRunning boards in the plebchan app is a planned feature.\n\n'
                )}
                >create a board</button>. All the content is just text, and plebchan's speed depends on how many users are <a href="https://github.com/plebbit/whitepaper/blob/master/contribute.md" target="_blank" rel="noreferrer">seeding</a>. Search for any board address above, or feel free to click on a popular board below that interests you and jump right in! </p>
                <br />
                <p>There are no global rules, each board is completely independent and its owner decides how it should be moderated.</p>
              </div>
            </AboutContent>
          </About>
          {account?.subscriptions?.length > 0 ? (
            <Boards>
                <BoardsTitle>
                  <h2>Subscriptions</h2>
                </BoardsTitle>
                <BoardsContent id="subscriptions">
                  <h3 style={{textDecoration: 'underline', display: 'inline'}}>
                    You have subscribed to {account?.subscriptions?.length} board{account?.subscriptions?.length > 1 ? "s" : null}
                  </h3>&nbsp;
                  <Link to="/p/subscriptions" id="view-all" onClick={()=> {window.scrollTo(0, 0)}}>[view all]</Link>
                  <br />
                  {account?.subscriptions?.map((subscription, index) => (
                    <Fragment key={`frag-${index}`}>
                      <Link key={`sub-${index}`} className="boardlink" 
                      onClick={()=> {window.scrollTo(0, 0)}}
                      to={`/p/${subscription}`}>
                        <br id="mobile-br" />
                        {subscription}&nbsp;
                      </Link>
                      <OfflineIndicator 
                        key={`offline-${index}`}
                        address={subscription} 
                        className="offline-text"
                        isText={true} />
                      <br key={`br-${index}`} />
                    </Fragment>
                  ))}
                  <br id="mobile-br" />
                </BoardsContent>
            </Boards>
          ) : null}
          <Boards>
              <BoardsTitle>
                <h2>Popular Boards</h2>
              </BoardsTitle>
              <BoardsContent>
                {defaultSubplebbits.map((subplebbit, index) => (
                  <div className="board" key={`board-${index}`}>
                    <div className="board-title" key="board-title">
                      {subplebbit.title ? subplebbit.title : <span style={{userSelect: "none"}}>&nbsp;</span>}
                    </div>
                    <div className="board-avatar-container" key="board-avatar-container">
                      <Link to={`/p/${subplebbit.address}`} key="link" onClick={() => {
                        setSelectedTitle(subplebbit.title);
                        setSelectedAddress(subplebbit.address);
                        window.scrollTo(0, 0);
                      }} >
                        <BoardAvatar key="baordavatar" address={subplebbit.address} />
                      </Link>
                      <OfflineIndicator 
                      address={subplebbit.address} 
                      className="offline-indicator"
                      tooltipPlace="top" 
                      key="oi2"/>
                    </div>
                    <div className="board-text" key="bt">
                      <b key="b">{subplebbit.address}</b>
                    </div>
                  </div>
                ))}
              </BoardsContent>
          </Boards>
        </Page>
        <Footer>
          <ul>
            <li className="fill"></li>
            <li className="first">
              <a href="https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f" target="_blank" rel="noopener noreferrer">Token</a>
            </li>
            <li>
              <a href="https://gitcoin.co/grants/5515/plebbit-a-serverless-adminless-decentralized-redd" target="_blank" rel="noopener noreferrer">Donate</a>
            </li>
            <li>
              <a href="https://github.com/plebbit/whitepaper/discussions/2" target="_blank" rel="noopener noreferrer">Whitepaper</a>
            </li>
            <li>
              <a href="https://github.com/plebbit/plebchan" target="_blank" rel="noopener noreferrer">GitHub</a>
            </li>
            <li>
              <a href="https://matrix.to/#/#plebbit:plebbitchat.org" target="_blank" rel="noopener noreferrer">Matrix</a>
            </li>
            <li>
              <a href="https://t.me/plebbit" target="_blank" rel="noopener noreferrer">Telegram</a>
            </li>
            <li>
              <a href="https://twitter.com/plebchan_eth" target="_blank" rel="noopener noreferrer">Twitter</a>
            </li>
            <li>
              <a href="https://discord.gg/E7ejphwzGW" target="_blank" rel="noopener noreferrer">Discord</a>
            </li>
          </ul>
        </Footer>
        <div style={{
          textAlign: "center",
          fontSize: "11px",
          marginBottom: "2em",
        }}>
          plebchan v{version}{commitRef}. GPL-2.0
        </div>
      </Container>
    </>
  )
};

export default Home;