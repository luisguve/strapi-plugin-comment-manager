/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
import axios from "../../utils/axiosInstance"
import { LatestComments, CommentsByKey } from "../../components/Comments"

const HomePage = () => {
  return (
    <Box background="neutral100" padding={8}>
      <Box paddingBottom={3} paddingTop={3}>
        <Typography variant="alpha" fontWeight="bold">Comments manager</Typography>
      </Box>
      <TabGroup label="Some stuff for the label" id="tabs" onTabChange={selected => console.log(selected)}>
        <Tabs>
          <Tab>Latest comments</Tab>
          <Tab>Comments by content ID</Tab>
        </Tabs>
        <TabPanels>
          <TabPanel>
            <LatestComments />
          </TabPanel>
          <TabPanel>
            <CommentsByKey />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Box>
  )
};

export default memo(HomePage);
