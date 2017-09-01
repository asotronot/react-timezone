import React from 'react';
import classNames from 'classnames/dedupe';
import Autocomplete from 'react-autocomplete';

import { injectTimezone } from '../../src/index';


const TIMEZONE_PARTS_DELIMITER = ' - ';

export const formatTimezone = (timezone) => {
    if (!timezone || !timezone.city || !timezone.zoneAbbr) return '';

    return `${timezone.city}${TIMEZONE_PARTS_DELIMITER}${timezone.zoneAbbr}`;
};

export const TimezoneOption = (item, isHighlighted) => (
    <div
        key={`${item.zoneName}-${item.zoneAbbr}`}
        className={classNames('timezone-option', {
            'timezone-option__highlighted': isHighlighted
        })}
    >
        {formatTimezone(item)}
    </div>
);


class InjectedAutocomplete extends React.PureComponent {
    constructor(props) {
        super(props);

        const { timezone } = this.props;

        const guessedTimezone = timezone.helper.guessCurrent();

        this.state = {
            timezoneValue: formatTimezone(guessedTimezone)
        };
    }

    render() {
        const { timezone } = this.props;
        const { timezoneValue } = this.state;

        const phrases = {
            timezonePickerLabel: 'Closest City or Timezone'
        };
        const menuStyle = {
            borderRadius: '2px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1rem',
            position: 'sticky',
            overflow: 'auto',
            width: '100%',
            minWidth: 'initial'
        };

        return (
            <div className="timezone_picker_container">
                <div className="timezone_picker_search">
                    <label id="timezone-picker-search-label" htmlFor="timezone-picker-search-input">
                        {phrases.timezonePickerLabel}
                    </label>
                    <Autocomplete
                        id="timezone-picker-search-input"
                        onChange={(event, value) => this.setState({ timezoneValue: value })}
                        onSelect={value => this.setState({ timezoneValue: value })}
                        menuStyle={menuStyle}
                        items={timezone.helper.allTimezones}
                        shouldItemRender={(item, searchValue) => timezone.helper.match(item, searchValue)}
                        getItemValue={item => formatTimezone(item)}
                        sortItems={(item1, item2) => timezone.helper.compare(item1, item2)}
                        renderItem={TimezoneOption}
                        value={timezoneValue}
                    />
                </div>
            </div>
        );
    }
}

export default injectTimezone(InjectedAutocomplete);
