import "./App.css";
import Navbar from "./components/Navbar.js";
import Champions from "./components/Champions.js"

import React, { Component } from 'react';

class App extends Component {
  state = {
    navs: [
    {
        id: 1,
        value: "All Champions",
        selected: true,
        sold: undefined
    },
    {
        id: 2,
        value: "Owned Champions",
        selected: false,
        sold: true
    },
    {
        id: 3,
        value: "Unowned Champions",
        selected: false,
        sold: false
    },    
  ],
    champions: [
      {
          id: 1,
          name: "Aatrox",
          classes: [
              "Fighter", "Tank"
          ],
          price: 5300,
          sold: true,
          skills: [
            "Triple Jump Slash", "Chain", "Umbral Dash", "Massacre"
          ]
      },
      {
          id: 2,
          name: "Ahri",
          classes: [
              "Assassin", "Mage"
          ],
          price: 3300,
          sold: true,
          skills: [
            "Orb of Deception", "Fire", "Charm", "Triple Dashes"
          ]
      },
      {
          id: 3,
          name: "Blitzcrank",
          classes: [
              "Support", "Tank"
          ],
          price: 3300,
          sold: false,
          skills: [
            "Hook", "Run", "Punch", "Thunder Bolt"
          ]
      },
      {
          id: 4,
          name: "Caitlyn",
          classes: [
              "Marksman"
          ],
          price: 4300,
          sold: true,
          skills: [
            "Focus", "Trap", "Net", "Ace in the Hole"
          ]
      },
      {
          id: 5,
          name: "Darius",
          classes: [
              "Fighter", "Tank"
          ],
          price: 4300,
          sold: true,
          skills: [
            "Swing", "Crippling Strike", "Apprehend", "Noxian Guillotine"
          ]
      },
      {
          id: 6,
          name: "Evelynn",
          classes: [
              "Assassin", "Mage"
          ],
          price: 1300,
          sold: false,
          skills: [
            "Spike", "Charm", "Stab", "Slash"
          ]
      },
      {
          id: 7,
          name: "Fiora",
          classes: [
              "Fighter"
          ],
          price: 5300,
          sold: true,
          skills: [
            "Dash Slash", "Riposte", "Empower", "Grand Challenge"
          ]
      },
      {
          id: 8,
          name: "Garen",
          classes: [
              "Fighter", "Tank"
          ],
          price: 450,
          sold: false,
          skills: [
            "Jump Slash", "Tekkai", "Whirlwind", "Sacred Relic"
          ]
      },
      {
          id: 9,
          name: "Hecarim",
          classes: [
              "Fighter", "Tank"
          ],
          price: 4300,
          sold: false,
          skills: [
            "Slash", "Detect", "Run", "Stampede"
          ]
      },
      {
          id: 10,
          name: "Irelia",
          classes: [
              "Fighter"
          ],
          price: 4300,
          sold: true,
          skills: [
            "Dash", "Shield", "Converging Blade", "Thounsands Blade"
          ]
      },
      {
          id: 11,
          name: "Jhin",
          classes: [
              "Marksman"
          ],
          price: 5300,
          sold: false,
          skills: [
            "Jumping Grenade", "Target", "Trap", "Snipe"
          ]
      },
      {
          id: 12,
          name: "Kai'sa",
          classes: [
              "Assassin", "Marksman"
          ],
          price: 5300,
          sold: true,
          skills: [
            "Missle Barrage", "Snipe", "Run", "Tag"
          ]
      },
      {
          id: 13,
          name: "Kayle",
          classes: [
              "Fighter", "Mage"
          ],
          price: 450,
          sold: true,
          skills: [
            "Radiant Blast", "Heal", "Blast", "Invincible Sword"
          ]
      },
      {
          id: 14,
          name: "Leona",
          classes: [
              "Support", "Tank"
          ],
          price: 450,
          sold: false,
          skills: [
            "Hook", "Shield", "Stun", "Solar Blast"
          ]
      },
      {
          id: 15,
          name: "Malzahar",
          classes: [
              "Mage", "Support"
          ],
          price: 4300,
          sold: false,
          skills: [
            "Void Slash", "Voidling", "Darkness", "Dark Chain"
          ]
      },
      {
          id: 16,
          name: "Nocturne",
          classes: [
              "Assassin", "Fighter"
          ],
          price: 4300,
          sold: true,
          skills: [
            "Dark Path", "Shield", "Fear", "Tag"
          ]
      },
      {
          id: 17,
          name: "Ornn",
          classes: [
              "Tank", "Support"
          ],
          price: 5300,
          sold: false,
          skills: [
            "Dash", "Flamethrower", "Smash", "Summon Spirit"
          ]
      },
      {
          id: 18,
          name: "Poppy",
          classes: [
              "Fighter", "Tank"
          ],
          price: 1300,
          sold: false,
          skills: [
            "Smash", "Shield", "Dash", "Hammer"
          ]
      },
      {
          id: 19,
          name: "Quinn",
          classes: [
              "Assassin", "Marksman"
          ],
          price: 4300,
          sold: false,
          skills: [
            "Blind", "Scout", "Vault", "Ride"
          ]
      },
      {
          id: 20,
          name: "Rumble",
          classes: [
              "Fighter", "Tank"
          ],
          price: 4300,
          sold: true,
          skills: [
            "Flamethrower", "Shield", "Missle", "Stronger Missle"
          ]
      },
      {
          id: 21,
          name: "Seraphine",
          classes: [
              "Mage", "Support"
          ],
          price: 6300,
          sold: false,
          skills: [
            "Pulse", "Shield", "Crowd Control", "Charm"
          ]
      },
      {
          id: 22,
          name: "Teemo",
          classes: [
              "Mage", "Marksman"
          ],
          price: 1300,
          sold: true,
          skills: [
            "Blind", "Run", "Poison", "Noxian Booby Trap"
          ]
      },
      {
          id: 23,
          name: "Udyr",
          classes: [
              "Fighter", "Tank"
          ],
          price: 1300,
          sold: false,
          skills: [
            "First Stance", "Second Stance", "Third Stance", "Fourth Stance"
          ]
      },
      {
          id: 24,
          name: "Vayne",
          classes: [
              "Assassin", "Marksman"
          ],
          price: 3300,
          sold: true,
          skills: [
            "Tumble", "Silver Bolts", "Condemn", "Final Hour"
          ]
      },
      {
          id: 25,
          name: "Xerath",
          classes: [
              "Mage"
          ],
          price: 4300,
          sold: false,
          skills: [
            "Straight Bolt", "Lightning Strike", "Orb Bolt", "Bolt Cannon"
          ]
      },
      {
          id: 26,
          name: "Zoe",
          classes: [
              "Assassin", "Mage"
          ],
          price: 5300,
          sold: false,
          skills: [
            "Spike Magic", "Spell Steal", "Drowsing Swamp", "Trick Teleport"
          ]
      }
  ],
  sold: undefined,
  }

  handleNavs = nav => {
    this.offNavs();
    this.getSold(nav);

    const navs = [...this.state.navs];
    const index = navs.indexOf(nav);
    navs[index] = {...nav};
    navs[index].selected = true;
    this.setState({ navs });
  }

  handleBuy = champion => {
    const champions = [...this.state.champions];
    const index = champions.indexOf(champion);
    champions[index] = { ...champion };
    champions[index].sold = true;
    this.setState({ champions });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar navs={this.state.navs} handleNavs={this.handleNavs} champions={this.state.champions}/>
        <Champions sold={this.state.sold}
          champions={this.state.champions} handleBuy={this.handleBuy}/>
      </React.Fragment>
    );
  }

  offNavs = () => {
    const navs = this.state.navs.map(nav => {
        nav.selected = false;
        return nav;
    })
    this.setState({ navs });
  }

  getSold = (nav) => {
    const sold = nav.sold;
    this.setState({ sold })
  }
}

export default App;
