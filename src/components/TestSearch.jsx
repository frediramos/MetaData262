import { useEffect, useState } from "react";
import MultipleSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";
import DisplayTests from "./DisplayTests";
import DisplayStatistics from "./DisplayStatistics";

import Popup from 'reactjs-popup';
import Button from "@mui/material/Button"
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function exportTests (tests) {
  const testPaths = [];
  tests.forEach(test => testPaths.push(test.path))
  const fileData = JSON.stringify(testPaths, null, 4); 
  const blob = new Blob([fileData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "tests-paths.json";
  link.href = url;
  link.click();
}



const TestSearch = () => {

  const metadata = require('../data/metadata.json');
  const [version, setVersion] = useState('');
  const [fetchedTests, setFetchedTests] = useState(false);
  const [presentType, setPresentType] = useState('Path');
  const [builtInGrouping, setBuiltInGrouping] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [selectedBuiltInBelong, setSelectedBuiltInBelong] = useState([]);
  const [selectedBuiltInContained, setSelectedBuiltInContained] = useState([]);
  const [listBuiltInsBelong, setListBuiltInsBelong] = useState([]);
  const [listBuiltInsContained, setListBuiltInsContained] = useState([]);
  const [listVersions, setListVersions] = useState([]);
  const [hasFirstSearch, setHasFirstSearch] = useState(false);

  // fetch info for query from database
  useEffect(() => {
 
    const tests = metadata 
    setAllTests(tests);
    const versions = new Set();
    const builtIns = new Set();
    const folders = new Set();
    tests.forEach(test => {
      if (test.version) versions.add(test.version);
      if (test.hasOwnProperty('builtIns')) Object.keys(test['builtIns']).forEach(builtIn => builtIns.add(builtIn));
      folders.add(test.pathSplit[1]);
    });
    versions.add('undefined');
    setListVersions([...versions].sort((a,b) => {return a-b;}));
    setListBuiltInsBelong([...folders].sort());
    setListBuiltInsContained([...builtIns].sort());
    setFetchedTests(true);

  }, [allTests, metadata]);



  const getSearchResultsFrontend = () => {
    const oneBuiltInEmpty = selectedBuiltInBelong.length === 0 || selectedBuiltInContained.length === 0;

    const filterBuiltInContained = (test) => {
      if (selectedBuiltInContained.length === 0) return true;

      let ret = false;
      selectedBuiltInContained.forEach((el) => {
        if (test['builtIns'] && Object.keys(test['builtIns']).includes(el)) {
          ret = true;
        }
      });
      return ret;
    };

    const filterBuiltInBelong = (test) => {
      return selectedBuiltInBelong.length === 0 || selectedBuiltInBelong.includes(test['pathSplit'][1])
    }

    const filterBuiltIn = (test) => {
      return builtInGrouping || oneBuiltInEmpty ?
        filterBuiltInBelong(test) && filterBuiltInContained(test)
        : filterBuiltInBelong(test) || filterBuiltInContained(test);
    }

    const result = allTests
      .filter(test => { return version === '' || parseInt(test.version) === version || (test.version === undefined && version === 'undefined') })
      .filter(filterBuiltIn);
    setSearchResults(result);
    setHasFirstSearch(true);
  }

  function MouseOver(event) {
    event.target.style.background = '#abb8c3';
  }
  function MouseOut(event){
    event.target.style.background="";
  }

  const overlayStyle = { background: 'rgba(0,0,0,0.5)' };


  return (
    <>
      <CssBaseline enableColorScheme />
      <Container align="center" disableGutters maxWidth="lg">
        <Typography variant='h2' component='h1'>MetaData262</Typography>
        <Divider variant="middle" />

        <Grid container justifyContent="center" sx={{ mb: 2 }}>
          
          <Grid item xs={1}> 
          <Popup trigger={<Typography variant='h5' component='h1'
            onMouseOver={MouseOver}
            onMouseOut={MouseOut}
            {...{overlayStyle}}
            
            >Authors</Typography>}  modal>
          
        <Box sx={{
          
        border: '2px solid',
        borderRadius: 1,  
        width: 300,
        height: 400,
        borderColor: 'grey.500',
        backgroundColor: 'white',
        }} >
          <List>

          <Typography variant='h5' component='h1' align="center">Authors</Typography>
          <Divider variant="middle" sx={{ mb: 2 }}/>

            <ListItem>
              <ListItemButton>
                <ListItemText  sx={{
              listStyleType: "disc",
              display: "list-item",
              }} primary="Frederico Ramos"  onClick={() => window.open('https://frediramos.github.io/', '_blank')} />
              </ListItemButton>
            </ListItem>
            
            <ListItem>
              <ListItemButton>
                <ListItemText  sx={{
              listStyleType: "disc",
              display: "list-item",
              }} primary="Diogo Reis"/>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton>
                <ListItemText  sx={{
              listStyleType: "disc",
              display: "list-item",
              }} primary="José Fragoso Santos"  onClick={() => window.open('https://web.ist.utl.pt/~jose.fragoso/', '_blank')} />
              </ListItemButton>
            </ListItem>
            
            <ListItem>
              <ListItemButton>
                <ListItemText  sx={{
              listStyleType: "disc",
              display: "list-item",
              }} primary="António Morgado"  onClick={() => window.open('https://scholar.google.com/citations?user=iAok8mcAAAAJ&hl=en', '_blank')} />
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton>
                <ListItemText  sx={{
              listStyleType: "disc",
              display: "list-item",
              }} primary="Miguel Trigo"/>
              </ListItemButton>
            </ListItem>

          </List>
          </Box>

        </Popup>

          </Grid>
          
          <Divider orientation="vertical" flexItem/>
         
          <Grid item xs={1}>   
            <Typography variant='h5' component='h1'
             onMouseOver={MouseOver}
             onMouseOut={MouseOut}  
             onClick={() => window.open('https://doi.org/10.5281/zenodo.7942804', '_blank')}>VM</Typography> 
          </Grid>
          

        </Grid>
        <Box>
          <Box>
            <MultipleSelect
              title='Folder'
              list={listBuiltInsBelong}
              selection={selectedBuiltInBelong}
              setSelection={setSelectedBuiltInBelong}
            />
            <ToggleButtonGroup
              sx={{ mt: 1 }}
              exclusive
              value={builtInGrouping}
              onChange={(_e, type) => {if(type !== null) setBuiltInGrouping(type)}}
              arial-label='Relation type'
            >
              <ToggleButton value={true} aria-label='And'>And</ToggleButton>
              <ToggleButton value={false} aria-label='Or'>Or</ToggleButton>
            </ToggleButtonGroup>
            <MultipleSelect
              title='BuiltIn Used'
              list={listBuiltInsContained}
              selection={selectedBuiltInContained}
              setSelection={setSelectedBuiltInContained}
            />
          </Box>
          <Box>
            <SingleSelect
              title='Version'
              list={listVersions}
              selection={version}
              setSelection={setVersion}
            />
            <Button
              sx={{ m: 2 }}
              size="large"
              variant="contained"
              onClick={getSearchResultsFrontend}
              disabled={!fetchedTests}
            >Local Search</Button>
          </Box>
        </Box>

        {hasFirstSearch && <Box textAlign='left' sx={{ mt: 2 }}>
          <ToggleButtonGroup
            sx={{ mb: 4 }}
            exclusive
            value={presentType}
            onChange={(_e, type) => {if(type !== null) setPresentType(type);}}
          >
            <ToggleButton value='Path' aria-label='Path'>Path</ToggleButton>
            <ToggleButton value='JSON' aria-label='JSON'>JSON</ToggleButton>
            <ToggleButton value='STATS' aria-label='STATS'>STATS</ToggleButton>
          </ToggleButtonGroup>
          
          <Box >        
            {presentType !== 'STATS' && <Box>
              <Typography variant='h6' component='h3' gutterBottom>Number of tests: {searchResults.length}</Typography>
   
              <Button onClick={() => exportTests(searchResults)}>
              Download
              </Button>
   
              <DisplayTests tests={searchResults} presentType={presentType} />
            </Box>}
            {presentType === 'STATS' && <Box>
            <Typography variant='h6' component='h3' textAlign="center" gutterBottom>Number of tests: {searchResults.length}</Typography>
              <DisplayStatistics tests={searchResults} versions={listVersions} />
            </Box>}
          </Box>
        
        </Box>}
      </Container>
    </>
  )
}

export default TestSearch
