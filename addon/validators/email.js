import MatchValidator from 'validity/validators/match';

export default MatchValidator.extend({

  options: {
    regex: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
  },
  /**
   * The default message to return if the validation failed.
   * This will be overridden if a message is supplied in the
   * validation map's options hash.
   *
   * @property {String}
   */
  defaultMessage: 'This is not a valid email'

});
