const { React } = require('powercord/webpack');
const { getModule, getModuleByDisplayName, getComponentByDisplayName } = require('powercord/webpack');
const { getRelationships } = getModule([ 'getRelationships' ]);
const { SwitchItem, TextInput, Category } = require('powercord/components/settings');
const { getUser } = getModule([ 'getUser' ]);
const { Sounds } = require('./Constants');
const Text = getModuleByDisplayName('Text');
const PopoutList = getModuleByDisplayName('PopoutList');
const FormDivider = getComponentByDisplayName('FormDivider');
const PopoutListSearchBar = PopoutList.prototype.constructor.SearchBar;
const PopoutListDivider = PopoutList.prototype.constructor.Divider;
const VerticalScroller = getModuleByDisplayName('VerticalScroller');
const Flex = getModuleByDisplayName('Flex');
const Avatar = getModuleByDisplayName('Avatar');
const FlexChild = Flex.prototype.constructor.Child;
const SelectableItem = PopoutList.prototype.constructor.Item;

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);

    const get = props.settings.get.bind(props.settings);
    this.plugin = powercord.pluginManager.get('betterfriends');

    this.state = {
      favfriends: get('favfriends', []),
      notifsounds: get('notifsounds', {}),
      infomodal: get('infomodal', true),
      displaystar: get('displaystar', true),
      statuspopup: get('statuspopup', true)
    };
  }

  render () {
    const { playSound } = getModule([ 'playSound' ]);
    const relationships = getRelationships();
    return (
      <div>
        <h5 className='h5-18_1nd title-3sZWYQ size12-3R0845 height16-2Lv3qA weightSemiBold-NJexzi marginBottom8-AtZOdT'>
          Manage favorited friends
        </h5>
        <div className='description-3_Ncsb formText-3fs7AJ marginBottom20-32qID7 modeDefault-3a2Ph1 primary-jw0I4K'>
          You can add or remove favorited friends from your friends list here.
        </div>
        <PopoutList
          className='bf-user-settings guildSettingsAuditLogsUserFilterPopout-3Jg5NE pc-guildSettingsAuditLogsUserFilterPopout elevationBorderHigh-2WYJ09 pc-elevationBorderHigh'
          popoutKey='bf-users'
        >
          <PopoutListSearchBar
            autoFocus={true}
            placeholder='Search friends'
            query=''
          />
          <PopoutListDivider/>
          <VerticalScroller
            className='scroller-2CvAgC pc-scroller'
          >
            {Object.keys(relationships)
              .filter(relation => relationships[relation] === 1)
              .map(getUser)
              .map((user, i) =>
                <SelectableItem className='bf-friend-item' id={user.id} key={i.toString()} selected={this.state.favfriends.includes(user.id)} onClick={(e) => {
                  if (!e.selected) {
                    this.state.favfriends.push(e.id);
                    this._set('favfriends', this.state.favfriends);
                  } else {
                    this._set('favfriends', this.state.favfriends.filter(a => a !== e.id));
                  }
                  e.setState({ selected: true });
                }}>
                  <Flex align='alignCenter-1dQNNs' basis='auto' grow={1} shrink={1}>
                    <div>
                      <Flex align='alignCenter-1dQNNs' basis='auto' grow={1} shrink={1}>
                        <FlexChild key='avatar' basis='auto' grow={0} shrink={0} wrap={false}>
                          <Avatar
                            src={!user.avatar ? `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                            size='small'
                          />
                        </FlexChild>
                        <FlexChild key='user-text' basis='auto' grow={1} shrink={1} wrap={false}>
                          <div class='userText-1WDPps'>
                            <span class='userText-1WDPps'>{user.username}</span>
                            <span class='discriminator-3tYCOD'>#{user.discriminator}</span>
                          </div>
                        </FlexChild>
                      </Flex>
                    </div>
                  </Flex>
                </SelectableItem>)
            }
          </VerticalScroller>
        </PopoutList>

        <FormDivider />

        <SwitchItem
          note='Toggles the functionality of the information button within the DM list on favorited friends'
          style={{ marginTop: '16px' }}
          value={this.state.infomodal}
          onChange={() => {
            this._set('infomodal');
            this.plugin.reload('InformationModal');
          }}
        >
          Information Modal
        </SwitchItem>

        <SwitchItem
          value={this.state.displaystar}
          onChange={() => {
            this._set('displaystar');
            this.plugin.reload('DisplayStar');
          }}
        >
          Display star next to favorited friends
        </SwitchItem>

        <SwitchItem
          note='Receive notifications in the bottom right-hand corner whenever a favorited friend changes their status'
          value={this.state.statuspopup}
          onChange={() => {
            this._set('statuspopup');
            this.plugin.reload('StatusPopup');
          }}
        >
          Show status notifications
        </SwitchItem>

        <Category
          name='Notification Sounds'
          description='Customize notification sounds specifically for favorited friends. You can put a link to an MP3 file in the textbox, or leave it blank to play the default sound'
          opened={this.state.notifsoundsOpened}
          onChange={() => this.setState({ notifsoundsOpened: !this.state.notifsoundsOpened })}
        >
          {Object.keys(Sounds)
            .map((sound) =>
              <div className='bf-notification-sounds'>
                <div style={{ float: 'left' }}>
                  <Text className='title-31JmR4 titleDefault-a8-ZSr medium-zmzTW- size16-14cGz5 height20-mO2eIN'>
                    <label className='title-31JmR4 titleDefault-a8-ZSr medium-zmzTW- size16-14cGz5 height20-mO2eIN'>
                      {Sounds[sound]}
                    </label>
                  </Text>
                </div>

                <div style={{ float: 'right' }}>
                  <div style={{ float: 'left' }}>
                    <button onClick={() => playSound(sound)} className='bf-notification-sounds-icon button-1Pkqso iconButton-eOTKg4 button-38aScr lookOutlined-3sRXeN colorWhite-rEQuAQ buttonSize-2Pmk-w iconButtonSize-U9SCYe grow-q77ONN'></button>
                  </div>
                  <div style={{ float: 'right',
                    paddingLeft: '16px' }}>
                    <TextInput
                      onChange={(value) => {
                        this.state.notifsounds[sound] = { url: value,
                          volume: 0.4 };
                        this._set('notifsounds', this.state.notifsounds);
                      }}
                      className='bf-textarea-notifsounds'
                      style={{ height: '33px' }}
                      placeholder='Link to MP3 file'
                      defaultValue={this.state.notifsounds[sound] ? this.state.notifsounds[sound].url : ''}
                    />
                  </div>
                </div>
              </div>
            )
          }
        </Category>
      </div>
    );
  }

  _set (key, value = !this.state[key], defaultValue) {
    if (!value && defaultValue) {
      value = defaultValue;
    }

    this.props.settings.set(key, value);
    this.setState({ [key]: value });
  }
};
