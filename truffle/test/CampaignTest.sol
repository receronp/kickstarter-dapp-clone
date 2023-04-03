// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../contracts/Campaign.sol";
// These files are dynamically created at test time
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

contract CampaignTest {
    function testConstructor() public {
        Campaign campaign = Campaign(DeployedAddresses.Campaign());

        Assert.equal(
            campaign.minimumContribution(),
            100,
            "100 wasn't set as the minimum contribution"
        );
        Assert.equal(
            campaign.approversCount(),
            0,
            "0 was not the initial approvers count"
        );
        Assert.equal(
            campaign.numRequests(),
            0,
            "0 was not the initial number of requests"
        );
    }
}
