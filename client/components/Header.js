import React from "react";
import Link from "next/link";
import { Menu } from "semantic-ui-react";

const Header = () => {
  return (
    <Menu style={{ marginTop: "1rem" }}>
      <Link href="/" className="item">
        CrowdCoin
      </Link>

      <Menu.Menu position="right">
        <Link href="/" className="item">
          Campaigns
        </Link>
        <Link href="/campaigns/new" className="item">
          +
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
