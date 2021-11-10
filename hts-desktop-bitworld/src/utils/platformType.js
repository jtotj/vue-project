import php from 'phpjs';
import isMobile from 'is-mobile';

const query = {};
php.parse_str(php.parse_url(window.location.href, 'PHP_URL_QUERY') || '', query);
const { force_mobile = null } = query;
const platform_type = isMobile() || force_mobile ? 'mobile' : 'desktop';

export default platform_type;
